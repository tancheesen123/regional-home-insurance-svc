using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace ApplicationService.Core.Application.ProposalService.Features.Proposal.Query
{
    /// <summary>
    /// Returns all proposals for a given customer, regardless of status.
    /// Each proposal includes its linked policy (if issued) and all policy documents.
    /// Proposal is the aggregate root — policy and documents are nested beneath it.
    /// </summary>
    public class GetCustomerProposalsQuery : IRequest<GetCustomerProposalsResult>
    {
        /// <summary>The customer whose proposals should be returned.</summary>
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
                    // Map policy documents if policy exists
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

                        // Quotation snapshot
                        PlanType = p.Quotation?.PlanType ?? string.Empty,
                        Region   = p.Quotation?.Region   ?? string.Empty,

                        // Insured personal info
                        InsuredName  = p.Name           ?? string.Empty,
                        MobileNumber = p.MobileNumber   ?? string.Empty,
                        Email        = p.Email          ?? string.Empty,

                        // Property address
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

        /// <summary>"PENDING" | "INFORCED" | "CANCELLED"</summary>
        public string Status { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        /// <summary>"building" | "contents" | "building-contents"</summary>
        public string PlanType { get; set; } = string.Empty;

        /// <summary>Region code: "ID" | "KH" | "PH"</summary>
        public string Region { get; set; } = string.Empty;

        public string InsuredName { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public CustomerProposalAddressDetail PropertyAddress { get; set; } = new();

        /// <summary>Null when the proposal has not yet been inforced.</summary>
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

        /// <summary>True once all PDF documents (PDS, ePolicy, Tax Invoice) have been generated.</summary>
        public bool IsDocumentReady { get; set; }

        /// <summary>
        /// Empty when IsDocumentReady is false.
        /// To download call GET /api/document/DownloadFile?proposalId=&amp;fileType=
        /// </summary>
        public List<CustomerProposalDocumentDetail> Documents { get; set; } = new();
    }

    public class CustomerProposalDocumentDetail
    {
        public string DocumentId { get; set; } = string.Empty;

        /// <summary>"PDS" | "EPolicy" | "TaxInvoice" | "PDS_Local" | "EPolicy_Local" | "TaxInvoice_Local"</summary>
        public string FileType { get; set; } = string.Empty;

        public string FileName { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }
}
