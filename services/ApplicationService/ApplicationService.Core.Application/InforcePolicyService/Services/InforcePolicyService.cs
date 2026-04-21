using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
using ApplicationService.Core.Application.PaymentService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace ApplicationService.Core.Application.InforcePolicyService.Services
{
    public class InforcePolicyService : IInforcePolicyService
    {
        private readonly ILogger<InforcePolicyService>  _logger;
        private readonly IProposalRepository            _proposalRepository;
        private readonly IPaymentRepository             _paymentRepository;
        private readonly IInforceService                _inforceService;
        private readonly IProposalErrorService          _errorService;

        // Regions where SMS is sent by default
        private static readonly HashSet<string> SmsDefaultOnRegions =
            new(StringComparer.OrdinalIgnoreCase) { "PH" };

        public InforcePolicyService(
            ILogger<InforcePolicyService> logger,
            IProposalRepository proposalRepository,
            IPaymentRepository paymentRepository,
            IInforceService inforceService,
            IProposalErrorService errorService)
        {
            _logger             = logger;
            _proposalRepository = proposalRepository;
            _paymentRepository  = paymentRepository;
            _inforceService     = inforceService;
            _errorService       = errorService;
        }

        public async Task<InforcePolicyResponse> InforcePolicyAsync(
            InforcePolicyRequest request, ClaimsPrincipal user)
        {
            _logger.LogInformation(
                "=== InforcePolicyService.InforcePolicyAsync | ProposalId={ProposalId} ===",
                request.ProposalId);

            try
            {
                if (string.IsNullOrWhiteSpace(request.ProposalId))
                    throw new ArgumentException("ProposalId is required.");

                var proposal = await _proposalRepository.GetByIdWithDetailsAsync(request.ProposalId);
                if (proposal == null)
                    throw new KeyNotFoundException($"Proposal '{request.ProposalId}' not found.");

                var region = proposal.Quotation?.Region?.ToUpper() ?? "XX";

                if (proposal.Status == "INFORCED")
                {
                    _logger.LogInformation("Proposal {ProposalId} already INFORCED.", proposal.ProposalId);
                    var existingPolicy = proposal.Policy;
                    return new InforcePolicyResponse
                    {
                        ProposalId      = proposal.ProposalId,
                        ProposalStatus  = "INFORCED",
                        PolicyId        = existingPolicy?.PolicyId        ?? string.Empty,
                        PolicyNumber    = existingPolicy?.PolicyNumber    ?? string.Empty,
                        PolicyStartDate = existingPolicy?.StartDate.ToString("dd/MM/yyyy") ?? string.Empty,
                        PolicyEndDate   = existingPolicy?.EndDate.ToString("dd/MM/yyyy")   ?? string.Empty,
                        PolicyDownloadUrl = request.WithUrlLink
                            ? BuildDownloadUrl(existingPolicy?.PolicyId)
                            : null,
                        AlreadyInforced = true,
                        Message = "Proposal already inforced. Returning existing policy."
                    };
                }

                bool checkPayment = request.CheckPayment ?? true;

                if (checkPayment)
                {
                    var payments = await _paymentRepository.GetByProposalIdAsync(request.ProposalId);
                    var hasPaid  = payments.Any(p => p.Status == "SUCCESS");
                    if (!hasPaid)
                        throw new InvalidOperationException(
                            $"No successful payment found for proposal '{request.ProposalId}'. " +
                            "Complete payment before inforcing the policy.");
                }

                var quotation = proposal.Quotation;
                var policy    = new Policy
                {
                    PolicyId       = Guid.NewGuid().ToString(),
                    PolicyNumber   = GeneratePolicyNumber(region),
                    StartDate      = quotation?.CoverageStartDate ?? DateTime.UtcNow.Date,
                    EndDate        = quotation?.ExpiryDate        ?? DateTime.UtcNow.Date.AddYears(1),
                    CoverageAmount = quotation?.Premium * 100     ?? 0m,
                    IssuedAt       = DateTime.UtcNow,
                    IssuedBy       = user.Identity?.Name ?? "SYSTEM",
                    ProposalId     = proposal.ProposalId,
                    CreatedAt      = DateTime.UtcNow
                };

                await _proposalRepository.InforceProposalAsync(proposal, policy);
                await _proposalRepository.SaveChangesAsync();

                _logger.LogInformation(
                    "Proposal {ProposalId} inforced. PolicyNumber={PolicyNumber}",
                    proposal.ProposalId, policy.PolicyNumber);

                bool sendSms = request.SendSms ?? SmsDefaultOnRegions.Contains(region);

                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _inforceService.BackendInvokeAsync(new BackendInvokeRequest
                        {
                            ProposalId   = proposal.ProposalId,
                            PolicyId     = policy.PolicyId,
                            PolicyNumber = policy.PolicyNumber,
                            Region       = region,
                            SendEmail    = request.SendEmail,
                            SendSms      = sendSms,
                        });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex,
                            "BackendInvoke failed for ProposalId={ProposalId}", proposal.ProposalId);
                    }
                });

                return new InforcePolicyResponse
                {
                    ProposalId        = proposal.ProposalId,
                    ProposalStatus    = "INFORCED",
                    PolicyId          = policy.PolicyId,
                    PolicyNumber      = policy.PolicyNumber,
                    PolicyStartDate   = policy.StartDate.ToString("dd/MM/yyyy"),
                    PolicyEndDate     = policy.EndDate.ToString("dd/MM/yyyy"),
                    PolicyDownloadUrl = request.WithUrlLink ? BuildDownloadUrl(policy.PolicyId) : null,
                    AlreadyInforced   = false,
                    Message           = "Proposal successfully inforced. Policy issued."
                };
            }
            catch (Exception ex) when (ex is not ArgumentException
                                           and not UnauthorizedAccessException)
            {
                await _errorService.LogErrorAsync(request.ProposalId, "InforcePolicy", ex);
                throw;
            }
        }


        private static string GeneratePolicyNumber(string region)
        {
            var year     = DateTime.UtcNow.Year;
            var sequence = new Random().Next(100000, 999999);
            return $"HI-{region.ToUpper()}-{year}-{sequence}";
        }

        private static string? BuildDownloadUrl(string? policyId)
        {
            if (string.IsNullOrEmpty(policyId)) return null;
            return $"/api/Policy/{policyId}/download";
        }
    }
}
