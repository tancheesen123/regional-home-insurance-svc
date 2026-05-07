using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProposalService.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace ApplicationService.Core.Application.DocumentService.Features.Document.Query
{
    /// <summary>
    /// Downloads a single policy PDF (PDS, ePolicy, or Tax Invoice) by file-type token.
    /// Only the authenticated customer who owns the proposal may call this endpoint.
    /// </summary>
    public class DownloadFileQuery : IRequest<DownloadFileResult>
    {
        public string ProposalId { get; set; } = string.Empty;

        public string FileType { get; set; } = string.Empty;

        /// <summary>Authenticated user — used for IDOR ownership check.</summary>
        public ClaimsPrincipal User { get; set; } = new ClaimsPrincipal();

        public class DownloadFileQueryHandler
            : IRequestHandler<DownloadFileQuery, DownloadFileResult>
        {
            private readonly ILogger<DownloadFileQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;
            private readonly DocumentSettings    _docSettings;

            // Maps the API fileType token → exact filename suffix (English versions).
            private static readonly Dictionary<string, string> FileTypeSuffix =
                new(StringComparer.OrdinalIgnoreCase)
                {
                    ["PDS"]        = "- PDS.pdf",
                    ["EPolicy"]    = "- ePolicy.pdf",
                    ["TaxInvoice"] = "- Tax Invoice.pdf",
                };

            // For local-language variants the suffix contains a parenthesised language name
            // that differs per region, so we match by a fixed infix instead.
            private static readonly HashSet<string> LocalFileTypes =
                new(StringComparer.OrdinalIgnoreCase)
                {
                    "PDS_Local", "EPolicy_Local", "TaxInvoice_Local"
                };

            private static readonly Dictionary<string, string> LocalFileTypeInfix =
                new(StringComparer.OrdinalIgnoreCase)
                {
                    ["PDS_Local"]         = "- PDS (",
                    ["EPolicy_Local"]     = "- ePolicy (",
                    ["TaxInvoice_Local"]  = "- Tax Invoice (",
                };

            public DownloadFileQueryHandler(
                ILogger<DownloadFileQueryHandler> logger,
                IProposalRepository proposalRepository,
                IOptions<DocumentSettings> docOptions)
            {
                _logger             = logger;
                _proposalRepository = proposalRepository;
                _docSettings        = docOptions.Value;
            }

            public async Task<DownloadFileResult> Handle(
                DownloadFileQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation(
                    "=== DownloadFile | ProposalId={ProposalId} FileType={FileType} ===",
                    request.ProposalId, request.FileType);

                var isLocal  = LocalFileTypes.Contains(request.FileType);
                var isEnglish = FileTypeSuffix.ContainsKey(request.FileType);
                if (!isEnglish && !isLocal)
                {
                    var allKeys = string.Join(", ", FileTypeSuffix.Keys.Concat(LocalFileTypes));
                    throw new ArgumentException(
                        $"Invalid fileType '{request.FileType}'. Accepted values: {allKeys}.");
                }

                var proposal = await _proposalRepository.GetByIdWithDetailsAsync(request.ProposalId);
                if (proposal == null)
                    throw new KeyNotFoundException($"Proposal '{request.ProposalId}' not found.");

                var customerId = request.User.FindFirst("customerId")?.Value ?? string.Empty;
                if (string.IsNullOrEmpty(customerId) || proposal.CustomerId != customerId)
                    throw new UnauthorizedAccessException(
                        "You are not authorised to download documents for this proposal.");

                var policy = proposal.Policy;
                if (policy == null)
                    throw new InvalidOperationException(
                        "Policy has not been issued yet. Documents are not available.");

                if (!policy.HasFullDocument)
                    throw new InvalidOperationException(
                        "Policy documents are still being generated. Please try again shortly.");

                var region   = (proposal.Quotation?.Region ?? string.Empty).ToUpper();
                var storeDir = Path.Combine(_docSettings.StoragePath, region, "Home", policy.PolicyId);

                if (!Directory.Exists(storeDir))
                    throw new KeyNotFoundException(
                        "Document folder not found. Please contact support.");

                string? filePath;
                if (isLocal)
                {
                    // Local files have a parenthesised language name: "- PDS (Bahasa Indonesia).pdf"
                    var infix = LocalFileTypeInfix[request.FileType];
                    filePath = Directory.GetFiles(storeDir, "*.pdf")
                        .FirstOrDefault(f =>
                        {
                            var name = Path.GetFileName(f);
                            return name.Contains(infix, StringComparison.OrdinalIgnoreCase) &&
                                   name.EndsWith(").pdf", StringComparison.OrdinalIgnoreCase);
                        });
                }
                else
                {
                    var suffix = FileTypeSuffix[request.FileType];
                    filePath = Directory.GetFiles(storeDir, "*.pdf")
                        .FirstOrDefault(f => Path.GetFileName(f).EndsWith(
                            suffix, StringComparison.OrdinalIgnoreCase));
                }

                if (filePath == null)
                    throw new KeyNotFoundException(
                        $"The {request.FileType} document was not found in the policy folder. " +
                        "Please contact support.");

                var fileName  = Path.GetFileName(filePath);
                var fileBytes = await File.ReadAllBytesAsync(filePath, cancellationToken);

                _logger.LogInformation(
                    "DownloadFile | Serving {FileType} ({FileName}) for PolicyNumber={PolicyNumber}",
                    request.FileType, fileName, policy.PolicyNumber);

                return new DownloadFileResult(fileBytes, fileName);
            }
        }
    }
    public record DownloadFileResult(byte[] FileBytes, string FileName);
}
