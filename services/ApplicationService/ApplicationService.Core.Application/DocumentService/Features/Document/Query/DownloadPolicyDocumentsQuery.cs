using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProposalService.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.IO.Compression;
using System.Security.Claims;

namespace ApplicationService.Core.Application.DocumentService.Features.Document.Query
{
    /// <summary>
    /// Streams all policy PDF documents (PDS, ePolicy, Tax Invoice) as a single ZIP file.
    /// Only the authenticated customer who owns the proposal may download their documents.
    /// </summary>
    public class DownloadPolicyDocumentsQuery : IRequest<DownloadPolicyDocumentsResult>
    {

        public string ProposalId { get; set; } = string.Empty;

        /// <summary>Authenticated user — used for IDOR ownership check.</summary>
        public ClaimsPrincipal User { get; set; } = new ClaimsPrincipal();

        public class DownloadPolicyDocumentsQueryHandler
            : IRequestHandler<DownloadPolicyDocumentsQuery, DownloadPolicyDocumentsResult>
        {
            private readonly ILogger<DownloadPolicyDocumentsQueryHandler> _logger;
            private readonly IProposalRepository _proposalRepository;
            private readonly DocumentSettings    _docSettings;

            public DownloadPolicyDocumentsQueryHandler(
                ILogger<DownloadPolicyDocumentsQueryHandler> logger,
                IProposalRepository proposalRepository,
                IOptions<DocumentSettings> docOptions)
            {
                _logger             = logger;
                _proposalRepository = proposalRepository;
                _docSettings        = docOptions.Value;
            }

            public async Task<DownloadPolicyDocumentsResult> Handle(
                DownloadPolicyDocumentsQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation(
                    "=== DownloadPolicyDocuments | ProposalId={ProposalId} ===",
                    request.ProposalId);

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

                var pdfFiles = Directory.GetFiles(storeDir, "*.pdf");
                if (pdfFiles.Length == 0)
                    throw new InvalidOperationException(
                        "No documents found in this policy folder.");

                var zipBytes = BuildZip(pdfFiles);

                var zipFileName = $"{policy.PolicyNumber} - Policy Documents.zip";

                _logger.LogInformation(
                    "DownloadPolicyDocuments | {FileCount} file(s) zipped for PolicyNumber={PolicyNumber}",
                    pdfFiles.Length, policy.PolicyNumber);

                return new DownloadPolicyDocumentsResult(zipBytes, zipFileName);
            }

            private static byte[] BuildZip(string[] pdfFiles)
            {
                using var ms      = new MemoryStream();
                using (var archive = new ZipArchive(ms, ZipArchiveMode.Create, leaveOpen: true))
                {
                    foreach (var filePath in pdfFiles)
                    {
                        var entryName = Path.GetFileName(filePath);
                        var entry     = archive.CreateEntry(entryName, CompressionLevel.Optimal);
                        using var entryStream = entry.Open();
                        using var fileStream  = File.OpenRead(filePath);
                        fileStream.CopyTo(entryStream);
                    }
                }
                return ms.ToArray();
            }
        }
    }

    public record DownloadPolicyDocumentsResult(byte[] ZipBytes, string FileName);
}
