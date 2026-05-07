using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace ApplicationService.Core.Application.ProposalService.Features.Policy.Query
{
    /// <summary>
    /// Returns a summary list of all inforced policies that belong to the authenticated customer.
    /// </summary>
    public class GetPoliciesQuery : IRequest<GetPoliciesResult>
    {
        /// <summary>Authenticated user — used to resolve the customer identity.</summary>
        public ClaimsPrincipal User { get; set; } = new ClaimsPrincipal();

        public class GetPoliciesQueryHandler
            : IRequestHandler<GetPoliciesQuery, GetPoliciesResult>
        {
            private readonly ILogger<GetPoliciesQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;

            public GetPoliciesQueryHandler(
                ILogger<GetPoliciesQueryHandler> logger,
                IProposalRepository proposalRepository)
            {
                _logger = logger;
                _proposalRepository = proposalRepository;
            }

            public async Task<GetPoliciesResult> Handle(
                GetPoliciesQuery request, CancellationToken cancellationToken)
            {
                var customerId = request.User.FindFirst("customerId")?.Value ?? string.Empty;
                if (string.IsNullOrEmpty(customerId))
                    throw new UnauthorizedAccessException("Customer identity could not be determined.");

                _logger.LogInformation(
                    "=== GetPolicies | CustomerId={CustomerId} ===", customerId);

                var proposals = await _proposalRepository.GetAllByCustomerIdAsync(customerId);

                var policies = proposals
                    .Where(p => p.Policy != null)
                    .Select(p => new PolicySummary
                    {
                        ProposalId       = p.ProposalId,
                        PolicyId         = p.Policy!.PolicyId,
                        PolicyNumber     = p.Policy.PolicyNumber,
                        PlanType         = p.Quotation?.PlanType ?? string.Empty,
                        Region           = p.Quotation?.Region   ?? string.Empty,
                        CoverageAmount   = p.Policy.CoverageAmount,
                        StartDate        = p.Policy.StartDate,
                        EndDate          = p.Policy.EndDate,
                        IssuedAt         = p.Policy.IssuedAt,
                        IsDocumentReady  = p.Policy.HasFullDocument,
                    })
                    .ToList();

                _logger.LogInformation(
                    "GetPolicies | CustomerId={CustomerId} returned {Count} policy(ies).",
                    customerId, policies.Count);

                return new GetPoliciesResult { Policies = policies };
            }
        }
    }

    public class GetPoliciesResult
    {
        public List<PolicySummary> Policies { get; set; } = new();
    }

    public class PolicySummary
    {
        /// <summary>Proposal that produced this policy.</summary>
        public string ProposalId { get; set; } = string.Empty;

        public string PolicyId { get; set; } = string.Empty;

        public string PolicyNumber { get; set; } = string.Empty;

        /// <summary>"building" | "contents" | "building-contents"</summary>
        public string PlanType { get; set; } = string.Empty;

        /// <summary>Region code: "ID" | "KH" | "PH"</summary>
        public string Region { get; set; } = string.Empty;

        public decimal CoverageAmount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public DateTime IssuedAt { get; set; }

        /// <summary>True once all PDF documents (PDS, ePolicy, Tax Invoice) have been generated.</summary>
        public bool IsDocumentReady { get; set; }
    }
}
