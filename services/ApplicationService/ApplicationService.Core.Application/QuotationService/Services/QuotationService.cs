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

        // ── CustomizePlan ─────────────────────────────────────────────────────

        public async Task<CustomizePlanResponse> CustomizePlanAsync(CustomizePlanRequest request)
        {
            _logger.LogInformation("=== QuotationService.CustomizePlanAsync ===");

            var quotation = await _quotationRepository.GetByIdAsync(request.QuotationId);
            if (quotation == null)
                throw new KeyNotFoundException($"Quotation '{request.QuotationId}' not found.");

            if (quotation.Status != "QUOTED")
                throw new InvalidOperationException($"Quotation is in '{quotation.Status}' status and cannot be customised.");

            // ── Validate plan type vs supplied sums ──────────────────────────
            var plan = request.PlanType.ToLower();
            if ((plan == "building" || plan == "building-contents") && (request.BuildingSum is null or <= 0))
                throw new ArgumentException("BuildingSum is required for plan type 'building' or 'building-contents'.");
            if ((plan == "contents" || plan == "building-contents") && (request.ContentsSum is null or <= 0))
                throw new ArgumentException("ContentsSum is required for plan type 'contents' or 'building-contents'.");

            // ── Base premium from sums insured ───────────────────────────────
            //   Building rate : 0.10 % of building sum
            //   Contents rate : 0.15 % of contents sum
            decimal basePremium = 0m;
            if (plan == "building" || plan == "building-contents")
                basePremium += (request.BuildingSum ?? 0) * 0.001m;   // 0.10 %
            if (plan == "contents" || plan == "building-contents")
                basePremium += (request.ContentsSum ?? 0) * 0.0015m;  // 0.15 %

            basePremium = Math.Round(basePremium, 2);

            // ── Add-on premiums (% of base premium) ──────────────────────────
            var addOns = request.AddOns ?? new AddOnsDto();

            decimal riotStrikePremium              = addOns.RiotStrike              ? Math.Round(basePremium * 0.05m, 2) : 0m;
            decimal extendedTheftPremium           = addOns.ExtendedTheft           ? Math.Round(basePremium * 0.08m, 2) : 0m;
            decimal altAccommodationPremium        = addOns.AlternativeAccommodation ? Math.Round(basePremium * 0.03m, 2) : 0m;
            decimal publicLiabilityPremium         = addOns.PublicLiability         ? Math.Round(basePremium * 0.04m, 2) : 0m;

            decimal addOnsPremium = riotStrikePremium + extendedTheftPremium + altAccommodationPremium + publicLiabilityPremium;
            decimal totalPremium  = Math.Round(basePremium + addOnsPremium, 2);
            decimal monthly       = Math.Round(totalPremium / 12, 2);

            // ── Persist plan details onto the quotation ───────────────────────
            quotation.PlanType                      = request.PlanType;
            quotation.BuildingSum                   = request.BuildingSum;
            quotation.ContentsSum                   = request.ContentsSum;
            quotation.HasRiotStrike                 = addOns.RiotStrike;
            quotation.HasExtendedTheft              = addOns.ExtendedTheft;
            quotation.HasAlternativeAccommodation   = addOns.AlternativeAccommodation;
            quotation.HasPublicLiability            = addOns.PublicLiability;
            quotation.Premium                       = totalPremium;
            quotation.UpdatedAt                     = DateTime.UtcNow;

            await _quotationRepository.UpdateQuotationPlanAsync(quotation);
            await _quotationRepository.SaveChangesAsync();

            return new CustomizePlanResponse
            {
                QuotationId   = quotation.QuotationId,
                PlanType      = quotation.PlanType,
                BuildingSum   = quotation.BuildingSum,
                ContentsSum   = quotation.ContentsSum,
                BasePremium   = basePremium,
                AddOnsPremium = addOnsPremium,
                TotalPremium  = totalPremium,
                AnnualPremium = totalPremium,
                MonthlyPremium = monthly,
                AddOnBreakdown = new AddOnBreakdownDto
                {
                    RiotStrike              = riotStrikePremium,
                    ExtendedTheft           = extendedTheftPremium,
                    AlternativeAccommodation = altAccommodationPremium,
                    PublicLiability         = publicLiabilityPremium
                }
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
