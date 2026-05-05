using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProposalService.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace ApplicationService.Core.Application.DocumentService.Features.Document.Query
{
    /// <summary>
    /// Returns whether all policy documents (PDS, ePolicy, Tax Invoice) have been generated.
    /// The frontend polls this endpoint after payment to know when to show the download modal.
    /// </summary>
    public class PolicyDocumentStatusQuery : IRequest<PolicyDocumentStatusResult>
    {

        public string ProposalId { get; set; } = string.Empty;

        public ClaimsPrincipal User { get; set; } = new ClaimsPrincipal();

        public class PolicyDocumentStatusQueryHandler
            : IRequestHandler<PolicyDocumentStatusQuery, PolicyDocumentStatusResult>
        {
            private readonly ILogger<PolicyDocumentStatusQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;
            private readonly DocumentSettings    _docSettings;

            public PolicyDocumentStatusQueryHandler(
                ILogger<PolicyDocumentStatusQueryHandler> logger,
                IProposalRepository proposalRepository,
                IOptions<DocumentSettings> docOptions)
            {
                _logger             = logger;
                _proposalRepository = proposalRepository;
                _docSettings        = docOptions.Value;
            }

            public async Task<PolicyDocumentStatusResult> Handle(
                PolicyDocumentStatusQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation(
                    "=== PolicyDocumentStatus | ProposalId={ProposalId} ===",
                    request.ProposalId);

                var proposal = await _proposalRepository.GetByIdWithDetailsAsync(request.ProposalId);
                if (proposal == null)
                    throw new KeyNotFoundException($"Proposal '{request.ProposalId}' not found.");

                var customerId = request.User.FindFirst("customerId")?.Value ?? string.Empty;
                if (string.IsNullOrEmpty(customerId) || proposal.CustomerId != customerId)
                    throw new UnauthorizedAccessException(
                        "You are not authorised to view documents for this proposal.");

                var policy = proposal.Policy;
                if (policy == null)
                    throw new InvalidOperationException(
                        "Policy has not been issued yet. Documents are not available.");

                if (!policy.HasFullDocument)
                {
                    return new PolicyDocumentStatusResult
                    {
                        IsReady      = false,
                        PolicyNumber = policy.PolicyNumber,
                        Documents    = new List<PolicyDocumentInfo>()
                    };
                }

                var region   = (proposal.Quotation?.Region ?? string.Empty).ToUpper();
                var storeDir = Path.Combine(_docSettings.StoragePath, region, "Home", policy.PolicyId);

                var documents = new List<PolicyDocumentInfo>();

                if (Directory.Exists(storeDir))
                {
                    var pdfFiles = Directory.GetFiles(storeDir, "*.pdf");
                    foreach (var filePath in pdfFiles)
                    {
                        var fileName = Path.GetFileName(filePath);
                        var fileType = ResolveFileType(fileName);
                        documents.Add(new PolicyDocumentInfo
                        {
                            FileType = fileType,
                            FileName = fileName
                        });
                    }

                    // Canonical sort: PDS → EPolicy → TaxInvoice
                    documents = documents
                        .OrderBy(d => FileTypeSortOrder(d.FileType))
                        .ToList();
                }

                _logger.LogInformation(
                    "PolicyDocumentStatus | ProposalId={ProposalId} IsReady=true Files={Count}",
                    request.ProposalId, documents.Count);

                return new PolicyDocumentStatusResult
                {
                    IsReady      = true,
                    PolicyNumber = policy.PolicyNumber,
                    Documents    = documents
                };
            }

            private static string ResolveFileType(string fileName)
            {
                if (fileName.EndsWith("- PDS.pdf",         StringComparison.OrdinalIgnoreCase))
                    return "PDS";
                if (fileName.EndsWith("- ePolicy.pdf",     StringComparison.OrdinalIgnoreCase))
                    return "EPolicy";
                if (fileName.EndsWith("- Tax Invoice.pdf", StringComparison.OrdinalIgnoreCase))
                    return "TaxInvoice";

                return "Other";
            }

            private static int FileTypeSortOrder(string fileType) => fileType switch
            {
                "PDS"        => 1,
                "EPolicy"    => 2,
                "TaxInvoice" => 3,
                _            => 99
            };
        }
    }

    public class PolicyDocumentStatusResult
    {
        /// <summary>True once all 3 documents (PDS, ePolicy, Tax Invoice) are ready.</summary>
        public bool IsReady { get; set; }

        /// <summary>Policy number — safe to return even when not yet ready.</summary>
        public string PolicyNumber { get; set; } = string.Empty;

        /// <summary>Empty list when IsReady = false.</summary>
        public List<PolicyDocumentInfo> Documents { get; set; } = new();
    }

    public class PolicyDocumentInfo
    {
        /// <summary>"PDS" | "EPolicy" | "TaxInvoice"</summary>
        public string FileType { get; set; } = string.Empty;

        /// <summary>Display filename, e.g. "HI-ID-2026-001234 - PDS.pdf"</summary>
        public string FileName { get; set; } = string.Empty;
    }
}
