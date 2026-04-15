using ApplicationService.Core.Application.QuotationService.DTOs;
using ApplicationService.Core.Application.QuotationService.Interfaces.Repositories;
using ApplicationService.Core.Application.QuotationService.Interfaces.Services;
using ApplicationService.Core.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.QuotationService.Services
{
    public class QuotationService : IQuotationService
    {
        private readonly ILogger<QuotationService> _logger;
        private readonly IQuotationRepository _quotationRepository;

        private const decimal BasePremium = 500m;

        public QuotationService(
            ILogger<QuotationService> logger,
            IQuotationRepository quotationRepository)
        {
            _logger = logger;
            _quotationRepository = quotationRepository;
        }

        // ── GetQuote ──────────────────────────────────────────────────────────

        public async Task<GetQuoteResponse> GetQuoteAsync(GetQuoteRequest request, string region)
        {
            _logger.LogInformation("=== QuotationService.GetQuoteAsync ===");

            var premium = CalculatePremium(request);

            var coverageStart = ParseDate(request.CoverageStartDate);
            var expiryDate    = coverageStart.AddYears(1);

            var quotation = new Quotation
            {
                QuotationId        = Guid.NewGuid().ToString(),
                Status             = "QUOTED",
                Premium            = premium,
                CoverageStartDate  = coverageStart,
                ExpiryDate         = expiryDate,
                Region             = region.ToUpper(),
                CustomerId         = request.CustomerId,
                ProductId          = null,
                OwnershipType      = request.OwnershipType,
                PropertyType       = request.PropertyType,
                PropertySubType    = request.PropertySubType,
                NumberOfStorey     = request.NumberOfStorey,
                ConstructionType   = request.ConstructionType,
                Postcode           = request.Postcode,
                CurrentFlooding    = request.CurrentFlooding.Equals("yes", StringComparison.OrdinalIgnoreCase),
                UnoccupiedProperty = request.UnoccupiedProperty.Equals("yes", StringComparison.OrdinalIgnoreCase),
                PreviousLoss       = request.PreviousLoss.Equals("yes", StringComparison.OrdinalIgnoreCase),
                IdType             = request.IdType,
                IdNumber           = request.IdNumber,
                Nationality        = request.Nationality,
                DateOfBirth        = request.DateOfBirth
            };

            await _quotationRepository.AddQuotationAsync(quotation);
            await _quotationRepository.SaveChangesAsync();

            return new GetQuoteResponse
            {
                QuotationId       = quotation.QuotationId,
                Status            = quotation.Status,
                Premium           = quotation.Premium,
                CoverageStartDate = quotation.CoverageStartDate.ToString("dd/MM/yyyy"),
                ExpiryDate        = quotation.ExpiryDate.ToString("dd/MM/yyyy"),
                OwnershipType     = quotation.OwnershipType,
                PropertyType      = quotation.PropertyType,
                PropertySubType   = quotation.PropertySubType,
                NumberOfStorey    = quotation.NumberOfStorey,
                ConstructionType  = quotation.ConstructionType,
                Postcode          = quotation.Postcode,
                Region            = quotation.Region
            };
        }

        // ── SubmitPolicy ──────────────────────────────────────────────────────

        public async Task<SubmitPolicyResponse> SubmitPolicyAsync(SubmitPolicyRequest request)
        {
            _logger.LogInformation("=== QuotationService.SubmitPolicyAsync ===");

            var quotation = await _quotationRepository.GetByIdAsync(request.QuotationId);
            if (quotation == null)
                throw new KeyNotFoundException($"Quotation '{request.QuotationId}' not found.");

            if (quotation.Status != "QUOTED")
                throw new InvalidOperationException($"Quotation is already '{quotation.Status}' and cannot be submitted.");

            // Resolve mailing address
            var mailing = request.MailingAddress;
            var prop    = request.PropertyAddress;

            var proposal = new Proposal
            {
                ProposalId           = Guid.NewGuid().ToString(),
                Status               = "PENDING",
                CustomerId           = quotation.CustomerId,
                QuotationId          = quotation.QuotationId,
                Name                 = request.PersonalDetails.Name,
                IdType               = request.PersonalDetails.IdType,
                IdNumber             = request.PersonalDetails.IdNumber,
                Nationality          = request.PersonalDetails.Nationality,
                Race                 = request.PersonalDetails.Race,
                Gender               = request.PersonalDetails.Gender,
                DateOfBirth          = request.PersonalDetails.DateOfBirth,
                MobileNumber         = request.PersonalDetails.MobileNumber,
                Email                = request.PersonalDetails.Email,
                PropAddressLine1     = prop.AddressLine1,
                PropAddressLine2     = prop.AddressLine2,
                PropCity             = prop.City,
                PropPostcode         = prop.Postcode,
                PropState            = prop.State,
                PropCountry          = prop.Country,
                MailingSameAsProperty = mailing.SameAsPropertyAddress,
                MailAddressLine1     = mailing.SameAsPropertyAddress ? prop.AddressLine1 : mailing.AddressLine1,
                MailAddressLine2     = mailing.SameAsPropertyAddress ? prop.AddressLine2 : mailing.AddressLine2,
                MailCity             = mailing.SameAsPropertyAddress ? prop.City         : mailing.City,
                MailPostcode         = mailing.SameAsPropertyAddress ? prop.Postcode     : mailing.Postcode,
                MailState            = mailing.SameAsPropertyAddress ? prop.State        : mailing.State,
                MailCountry          = mailing.SameAsPropertyAddress ? prop.Country      : mailing.Country,
                BankName             = request.BankDetails.BankName,
                BankAccountNumber    = request.BankDetails.AccountNumber
            };

            var startDate = quotation.CoverageStartDate;
            var endDate   = startDate.AddYears(1);

            var policy = new Policy
            {
                PolicyId        = Guid.NewGuid().ToString(),
                PolicyNumber    = GeneratePolicyNumber(quotation.Region),
                StartDate       = startDate,
                EndDate         = endDate,
                CoverageAmount  = quotation.Premium * 100,   // coverage = premium × 100
                IssuedAt        = DateTime.UtcNow,
                IssuedBy        = "SYSTEM",
                ProposalId      = proposal.ProposalId
            };

            await _quotationRepository.AddProposalAsync(proposal);
            await _quotationRepository.AddPolicyAsync(policy);
            await _quotationRepository.UpdateQuotationStatusAsync(quotation.QuotationId, "CONVERTED");
            await _quotationRepository.SaveChangesAsync();

            return new SubmitPolicyResponse
            {
                PolicyId    = policy.PolicyId,
                PolicyNumber = policy.PolicyNumber,
                ProposalId  = proposal.ProposalId,
                QuotationId = quotation.QuotationId,
                Premium     = quotation.Premium,
                StartDate   = policy.StartDate.ToString("dd/MM/yyyy"),
                EndDate     = policy.EndDate.ToString("dd/MM/yyyy"),
                Status      = proposal.Status,
                Message     = "Policy submitted successfully."
            };
        }

        // ── Premium Calculation ───────────────────────────────────────────────

        private decimal CalculatePremium(GetQuoteRequest request)
        {
            var premium = BasePremium;

            // Construction type
            premium *= request.ConstructionType.Equals("full-brick", StringComparison.OrdinalIgnoreCase)
                ? 1.0m : 1.3m;

            // Number of storeys
            premium *= request.NumberOfStorey switch
            {
                1 => 1.0m,
                2 => 1.1m,
                _ => 1.2m
            };

            // Risk factors
            if (request.CurrentFlooding.Equals("yes", StringComparison.OrdinalIgnoreCase))
                premium *= 1.25m;

            if (request.UnoccupiedProperty.Equals("yes", StringComparison.OrdinalIgnoreCase))
                premium *= 1.20m;

            if (request.PreviousLoss.Equals("yes", StringComparison.OrdinalIgnoreCase))
                premium *= 1.15m;

            return Math.Round(premium, 2);
        }

        private string GeneratePolicyNumber(string region)
        {
            var year     = DateTime.UtcNow.Year;
            var sequence = new Random().Next(100000, 999999);
            return $"HI-{region}-{year}-{sequence}";
        }

        private DateTime ParseDate(string date)
        {
            if (DateTime.TryParseExact(date, "dd/MM/yyyy",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var result))
                return result;

            return DateTime.UtcNow.Date;
        }
    }
}
