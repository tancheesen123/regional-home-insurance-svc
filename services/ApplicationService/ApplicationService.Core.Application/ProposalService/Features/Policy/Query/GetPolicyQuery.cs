using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Text.Json;

namespace ApplicationService.Core.Application.ProposalService.Features.Policy.Query
{
    public class GetPolicyQuery : IRequest<GetPolicyResult>
    {
        public string ProposalId { get; set; } = string.Empty;

        public ClaimsPrincipal User { get; set; } = new ClaimsPrincipal();

        public class GetPolicyQueryHandler
            : IRequestHandler<GetPolicyQuery, GetPolicyResult>
        {
            private readonly ILogger<GetPolicyQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;

            public GetPolicyQueryHandler(
                ILogger<GetPolicyQueryHandler> logger,
                IProposalRepository proposalRepository)
            {
                _logger = logger;
                _proposalRepository = proposalRepository;
            }

            public async Task<GetPolicyResult> Handle(
                GetPolicyQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation(
                    "=== GetPolicy | ProposalId={ProposalId} ===", request.ProposalId);

                var customerId = request.User.FindFirst("customerId")?.Value ?? string.Empty;
                if (string.IsNullOrEmpty(customerId))
                    throw new UnauthorizedAccessException("Customer identity could not be determined.");

                var proposals = await _proposalRepository.GetAllByCustomerIdAsync(customerId);
                var p = proposals.FirstOrDefault(x => x.ProposalId == request.ProposalId);

                if (p == null)
                    throw new KeyNotFoundException($"Proposal '{request.ProposalId}' not found.");

                if (p.CustomerId != customerId)
                    throw new UnauthorizedAccessException(
                        "You are not authorised to view this policy.");

                if (p.Policy == null)
                    throw new InvalidOperationException(
                        "Policy has not been issued yet for this proposal.");

                var policy = p.Policy;

                var documents = DeserializeDocuments(policy.DocumentsJson)
                    .Select(d => new PolicyDocumentDetail
                    {
                        DocumentId = d.DocumentId,
                        FileType   = d.FileType,
                        FileName   = d.FileName,
                        UploadedAt = d.UploadedAt,
                    })
                    .ToList();

                var result = new GetPolicyResult
                {
                    ProposalId   = p.ProposalId,
                    PolicyId     = policy.PolicyId,
                    PolicyNumber = policy.PolicyNumber,
                    PlanType     = p.Quotation?.PlanType  ?? string.Empty,
                    Region       = p.Quotation?.Region    ?? string.Empty,

                    PropertyAddress = new PropertyAddressDetail
                    {
                        AddressLine1 = p.PropAddressLine1 ?? string.Empty,
                        AddressLine2 = p.PropAddressLine2 ?? string.Empty,
                        City         = p.PropCity         ?? string.Empty,
                        Postcode     = p.PropPostcode     ?? string.Empty,
                        State        = p.PropState        ?? string.Empty,
                        Country      = p.PropCountry      ?? string.Empty,
                    },

                    CoverageAmount  = policy.CoverageAmount,
                    StartDate       = policy.StartDate,
                    EndDate         = policy.EndDate,
                    IssuedAt        = policy.IssuedAt,
                    IssuedBy        = policy.IssuedBy,
                    IsDocumentReady = policy.HasFullDocument,
                    Documents       = documents,
                };

                _logger.LogInformation(
                    "GetPolicy | ProposalId={ProposalId} PolicyNumber={PolicyNumber} Documents={Count}",
                    request.ProposalId, policy.PolicyNumber, documents.Count);

                return result;
            }

            private static List<DocEntry> DeserializeDocuments(string? json)
            {
                if (string.IsNullOrWhiteSpace(json)) return new List<DocEntry>();
                try { return JsonSerializer.Deserialize<List<DocEntry>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new(); }
                catch { return new List<DocEntry>(); }
            }

            private class DocEntry
            {
                public string DocumentId { get; set; } = string.Empty;
                public string FileType   { get; set; } = string.Empty;
                public string FileName   { get; set; } = string.Empty;
                public DateTime UploadedAt { get; set; }
            }
        }
    }

    public class GetPolicyResult
    {
        public string ProposalId { get; set; } = string.Empty;
        public string PolicyId { get; set; } = string.Empty;
        public string PolicyNumber { get; set; } = string.Empty;

        public string PlanType { get; set; } = string.Empty;

        public string Region { get; set; } = string.Empty;

        public PropertyAddressDetail PropertyAddress { get; set; } = new();

        public decimal CoverageAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime IssuedAt { get; set; }
        public string IssuedBy { get; set; } = string.Empty;

        public bool IsDocumentReady { get; set; }

        public List<PolicyDocumentDetail> Documents { get; set; } = new();
    }

    public class PropertyAddressDetail
    {
        public string AddressLine1 { get; set; } = string.Empty;
        public string AddressLine2 { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class PolicyDocumentDetail
    {
        public string DocumentId { get; set; } = string.Empty;

        public string FileType { get; set; } = string.Empty;

        public string FileName { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }
}
