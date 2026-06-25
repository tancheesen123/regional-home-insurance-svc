using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace ApplicationService.Core.Application.ProposalService.Features.Proposal.Query
{
    public class GetCustomerProposalsQuery : IRequest<GetCustomerProposalsResult>
    {
        public string CustomerId { get; set; } = string.Empty;

        public class GetCustomerProposalsQueryHandler
            : IRequestHandler<GetCustomerProposalsQuery, GetCustomerProposalsResult>
        {
            private readonly ILogger<GetCustomerProposalsQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;

            public GetCustomerProposalsQueryHandler(
                ILogger<GetCustomerProposalsQueryHandler> logger,
                IProposalRepository proposalRepository)
            {
                _logger = logger;
                _proposalRepository = proposalRepository;
            }

            public async Task<GetCustomerProposalsResult> Handle(
                GetCustomerProposalsQuery request, CancellationToken cancellationToken)
            {
                var customerId = request.CustomerId;
                if (string.IsNullOrEmpty(customerId))
                    throw new ArgumentException("customerId is required.");

                _logger.LogInformation(
                    "=== GetCustomerProposals | CustomerId={CustomerId} ===", customerId);

                var proposals = await _proposalRepository.GetProposalsByCustomerIdAsync(customerId);

                var result = proposals.Select(p =>
                {
                    List<CustomerProposalDocumentDetail> documents = new();
                    CustomerProposalPolicyDetail? policyDetail = null;

                    if (p.Policy != null)
                    {
                        documents = DeserializeDocuments(p.Policy.DocumentsJson)
                            .Select(d => new CustomerProposalDocumentDetail
                            {
                                DocumentId = d.DocumentId,
                                FileType   = d.FileType,
                                FileName   = d.FileName,
                                UploadedAt = d.UploadedAt,
                            })
                            .ToList();

                        policyDetail = new CustomerProposalPolicyDetail
                        {
                            PolicyId        = p.Policy.PolicyId,
                            PolicyNumber    = p.Policy.PolicyNumber,
                            CoverageAmount  = p.Policy.CoverageAmount,
                            StartDate       = p.Policy.StartDate,
                            EndDate         = p.Policy.EndDate,
                            IssuedAt        = p.Policy.IssuedAt,
                            IssuedBy        = p.Policy.IssuedBy,
                            IsDocumentReady = p.Policy.HasFullDocument,
                            Documents       = documents,
                        };
                    }

                    return new CustomerProposalDetail
                    {
                        ProposalId  = p.ProposalId,
                        Status      = p.Status,
                        CreatedAt   = p.CreatedAt,

                        PlanType = p.Quotation?.PlanType ?? string.Empty,
                        Region   = p.Quotation?.Region   ?? string.Empty,

                        InsuredName  = p.Name           ?? string.Empty,
                        MobileNumber = p.MobileNumber   ?? string.Empty,
                        Email        = p.Email          ?? string.Empty,

                        PropertyAddress = new CustomerProposalAddressDetail
                        {
                            AddressLine1 = p.PropAddressLine1 ?? string.Empty,
                            AddressLine2 = p.PropAddressLine2 ?? string.Empty,
                            City         = p.PropCity         ?? string.Empty,
                            Postcode     = p.PropPostcode     ?? string.Empty,
                            State        = p.PropState        ?? string.Empty,
                            Country      = p.PropCountry      ?? string.Empty,
                        },

                        Policy = policyDetail,
                    };
                }).ToList();

                _logger.LogInformation(
                    "GetCustomerProposals | CustomerId={CustomerId} returned {Count} proposal(s).",
                    customerId, result.Count);

                return new GetCustomerProposalsResult { Proposals = result };
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

    public class GetCustomerProposalsResult
    {
        public List<CustomerProposalDetail> Proposals { get; set; } = new();
    }

    public class CustomerProposalDetail
    {
        public string ProposalId { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public string PlanType { get; set; } = string.Empty;

        public string Region { get; set; } = string.Empty;

        public string InsuredName { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public CustomerProposalAddressDetail PropertyAddress { get; set; } = new();

        public CustomerProposalPolicyDetail? Policy { get; set; }
    }

    public class CustomerProposalAddressDetail
    {
        public string AddressLine1 { get; set; } = string.Empty;
        public string AddressLine2 { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class CustomerProposalPolicyDetail
    {
        public string PolicyId { get; set; } = string.Empty;
        public string PolicyNumber { get; set; } = string.Empty;
        public decimal CoverageAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime IssuedAt { get; set; }
        public string IssuedBy { get; set; } = string.Empty;

        public bool IsDocumentReady { get; set; }

        public List<CustomerProposalDocumentDetail> Documents { get; set; } = new();
    }

    public class CustomerProposalDocumentDetail
    {
        public string DocumentId { get; set; } = string.Empty;

        public string FileType { get; set; } = string.Empty;

        public string FileName { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }
}
