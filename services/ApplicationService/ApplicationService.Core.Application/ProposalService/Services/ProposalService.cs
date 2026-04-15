using ApplicationService.Core.Application.ProposalService.DTOs;
using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using ApplicationService.Core.Application.QuotationService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProposalService.Services
{
    public class ProposalService : IProposalService
    {
        private readonly ILogger<ProposalService> _logger;
        private readonly IProposalRepository _proposalRepository;
        private readonly IQuotationRepository _quotationRepository;

        public ProposalService(
            ILogger<ProposalService> logger,
            IProposalRepository proposalRepository,
            IQuotationRepository quotationRepository)
        {
            _logger = logger;
            _proposalRepository = proposalRepository;
            _quotationRepository = quotationRepository;
        }

        // ── CreateProposal ────────────────────────────────────────────────────

        public async Task<CreateProposalResponse> CreateProposalAsync(CreateProposalRequest request)
        {
            _logger.LogInformation("=== ProposalService.CreateProposalAsync ===");

            // ── Validate quotation ────────────────────────────────────────────
            var quotation = await _quotationRepository.GetByIdAsync(request.QuotationId);
            if (quotation == null)
                throw new KeyNotFoundException($"Quotation '{request.QuotationId}' not found.");

            if (quotation.Status == "LOCKED")
                throw new InvalidOperationException("A proposal has already been created for this quotation.");

            if (quotation.Status == "CONVERTED")
                throw new InvalidOperationException("This quotation has already been converted to a policy.");

            if (quotation.Status != "QUOTED")
                throw new InvalidOperationException($"Quotation is in '{quotation.Status}' status and cannot be proposed.");

            // ── Check for an existing proposal ────────────────────────────────
            var existingProposal = await _proposalRepository.GetByQuotationIdAsync(request.QuotationId);
            if (existingProposal != null)
                throw new InvalidOperationException($"A proposal '{existingProposal.ProposalId}' already exists for this quotation.");

            // ── Resolve mailing address ───────────────────────────────────────
            var mailing = request.MailingAddress;
            var prop    = request.PropertyAddress;

            var proposal = new Proposal
            {
                ProposalId            = Guid.NewGuid().ToString(),
                Status                = "PENDING",
                CustomerId            = quotation.CustomerId,
                QuotationId           = quotation.QuotationId,
                Name                  = request.PersonalDetails.Name,
                IdType                = request.PersonalDetails.IdType,
                IdNumber              = request.PersonalDetails.IdNumber,
                Nationality           = request.PersonalDetails.Nationality,
                Race                  = request.PersonalDetails.Race,
                Gender                = request.PersonalDetails.Gender,
                DateOfBirth           = request.PersonalDetails.DateOfBirth,
                MobileNumber          = request.PersonalDetails.MobileNumber,
                Email                 = request.PersonalDetails.Email,
                PropAddressLine1      = prop.AddressLine1,
                PropAddressLine2      = prop.AddressLine2,
                PropCity              = prop.City,
                PropPostcode          = prop.Postcode,
                PropState             = prop.State,
                PropCountry           = prop.Country,
                MailingSameAsProperty = mailing.SameAsPropertyAddress,
                MailAddressLine1      = mailing.SameAsPropertyAddress ? prop.AddressLine1  : mailing.AddressLine1,
                MailAddressLine2      = mailing.SameAsPropertyAddress ? prop.AddressLine2  : mailing.AddressLine2,
                MailCity              = mailing.SameAsPropertyAddress ? prop.City          : mailing.City,
                MailPostcode          = mailing.SameAsPropertyAddress ? prop.Postcode      : mailing.Postcode,
                MailState             = mailing.SameAsPropertyAddress ? prop.State         : mailing.State,
                MailCountry           = mailing.SameAsPropertyAddress ? prop.Country       : mailing.Country,
                BankName              = request.BankDetails.BankName,
                BankAccountNumber     = request.BankDetails.AccountNumber,
                CreatedAt             = DateTime.UtcNow
            };

            // Atomically create proposal + lock quotation (same DbContext unit-of-work)
            await _proposalRepository.CreateProposalAndLockQuotationAsync(proposal);
            await _proposalRepository.SaveChangesAsync();

            return new CreateProposalResponse
            {
                ProposalId        = proposal.ProposalId,
                QuotationId       = quotation.QuotationId,
                Status            = proposal.Status,
                QuotationStatus   = "LOCKED",
                Premium           = quotation.Premium,
                CoverageStartDate = quotation.CoverageStartDate.ToString("dd/MM/yyyy"),
                ExpiryDate        = quotation.ExpiryDate.ToString("dd/MM/yyyy"),
                Message           = "Proposal created successfully. Quotation is now locked."
            };
        }
    }
}
