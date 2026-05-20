using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using ApplicationService.Core.Application.ProposalService.Settings;
using ApplicationService.Core.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.IO.Compression;
using System.Xml;
using System.Xml.Xsl;

namespace ApplicationService.Core.Application.SalesService.Features.Command
{

    public class SendSalesEmailCommand : IRequest<SendSalesEmailResult>
    {
        /// <summary>ProposalId of the sales record whose email should be sent.</summary>
        public string RecordId { get; set; } = string.Empty;
        public string ToEmail  { get; set; } = string.Empty;

        public class SendSalesEmailCommandHandler
            : IRequestHandler<SendSalesEmailCommand, SendSalesEmailResult>
        {
            private readonly ILogger<SendSalesEmailCommandHandler> _logger;
            private readonly IProposalRepository                   _proposalRepository;
            private readonly INotificationEmailService             _emailService;
            private readonly DocumentSettings                      _docSettings;

            public SendSalesEmailCommandHandler(
                ILogger<SendSalesEmailCommandHandler> logger,
                IProposalRepository                   proposalRepository,
                INotificationEmailService             emailService,
                IOptions<DocumentSettings>            docOptions)
            {
                _logger             = logger;
                _proposalRepository = proposalRepository;
                _emailService       = emailService;
                _docSettings        = docOptions.Value;
            }

            public async Task<SendSalesEmailResult> Handle(
                SendSalesEmailCommand command, CancellationToken cancellationToken)
            {
                _logger.LogInformation(
                    "=== SendSalesEmail | RecordId={RecordId} To={To} ===",
                    command.RecordId, MaskEmail(command.ToEmail));

                if (string.IsNullOrWhiteSpace(command.ToEmail))
                    return Fail("Recipient email address ('to') is required.");

                var proposal = await _proposalRepository.GetSalesRecordByProposalIdAsync(command.RecordId);
                if (proposal == null)
                    throw new KeyNotFoundException($"Sales record '{command.RecordId}' not found.");

                var policy = proposal.Policy;
                if (policy == null)
                    throw new InvalidOperationException(
                        "Policy has not been issued yet. Email cannot be sent.");

                var policyNumber = policy.PolicyNumber ?? string.Empty;
                var region       = (proposal.Quotation?.Region ?? string.Empty).ToUpper();

                // ── 3. Build HTML body (XSL → fallback) ─────────────────────────
                var entity   = _docSettings.Entity.ToLower();
                var emailXsl = Path.Combine(
                    _docSettings.DocsPath, "Home", "Email",
                    $"{entity}_hohh_success_en.xsl");

                string htmlBody;
                var fromXsl = TryBuildFromXsl(proposal, policyNumber, emailXsl, region);
                if (fromXsl != null)
                {
                    htmlBody = fromXsl;
                }
                else
                {
                    _logger.LogWarning(
                        "SendSalesEmail | XSL not found or failed at {Path} — using fallback HTML.",
                        emailXsl);
                    htmlBody = BuildFallbackEmailHtml(proposal, policyNumber);
                }

                var storeDir    = Path.Combine(_docSettings.StoragePath, region, "Home", policy.PolicyId);
                var zipBytes    = ZipPolicyDocuments(storeDir);
                var attachments = new List<EmailAttachment>();

                if (zipBytes != null)
                {
                    attachments.Add(new EmailAttachment
                    {
                        FileName    = $"{policyNumber}-AllDocuments.zip",
                        Content     = zipBytes,
                        ContentType = "application/zip",
                    });
                }

                var subject = $"Home Insurance : Your ePolicy is ready ({policyNumber})";
                var toName  = proposal.Name ?? string.Empty;

                _logger.LogInformation(
                    "SendSalesEmail | Sending to {To} | PolicyNumber={PolicyNumber}",
                    MaskEmail(command.ToEmail), policyNumber);

                var sent = await _emailService.SendPolicyEmailAsync(
                    toEmail:     command.ToEmail,
                    toName:      toName,
                    subject:     subject,
                    htmlBody:    htmlBody,
                    attachments: attachments);

                if (sent)
                {
                    _logger.LogInformation(
                        "SendSalesEmail SUCCESS | RecordId={RecordId}", command.RecordId);
                    return new SendSalesEmailResult { Succeeded = true, Message = "Email sent successfully." };
                }
                else
                {
                    _logger.LogWarning(
                        "SendSalesEmail | Email service returned false | RecordId={RecordId}", command.RecordId);
                    return new SendSalesEmailResult { Succeeded = false, Message = "Email could not be delivered. Please try again." };
                }
            }

            private string? TryBuildFromXsl(Proposal proposal, string policyNumber, string xslPath, string region)
            {
                if (!File.Exists(xslPath))
                    return null;

                try
                {
                    var q  = proposal.Quotation;
                    var qp = q?.QuotationPremium;

                    var xmlDoc = new XmlDocument();
                    var root   = xmlDoc.CreateElement("Policy");
                    xmlDoc.AppendChild(root);

                    void AddNode(string name, string? value)
                    {
                        var node = xmlDoc.CreateElement(name);
                        node.InnerText = value ?? string.Empty;
                        root.AppendChild(node);
                    }

                    AddNode("PolicyNumber",   policyNumber);
                    AddNode("CustomerName",   proposal.Name);
                    AddNode("CustomerEmail",  proposal.Email);
                    AddNode("Region",         region);
                    AddNode("PlanType",       q?.PlanType);
                    AddNode("BuildingSum",    (q?.BuildingSum  ?? 0m).ToString("N2"));
                    AddNode("ContentsSum",    (q?.ContentsSum  ?? 0m).ToString("N2"));
                    AddNode("TotalPremium",   (qp?.TotalPremium ?? 0m).ToString("N2"));
                    AddNode("StartDate",      proposal.Policy?.StartDate.ToString("yyyy-MM-dd") ?? string.Empty);
                    AddNode("EndDate",        proposal.Policy?.EndDate.ToString("yyyy-MM-dd")   ?? string.Empty);

                    var xslt = new XslCompiledTransform();
                    xslt.Load(xslPath);

                    using var reader    = new XmlNodeReader(xmlDoc);
                    using var swResult  = new System.IO.StringWriter();
                    using var xmlWriter = XmlWriter.Create(swResult, xslt.OutputSettings);
                    xslt.Transform(reader, xmlWriter);
                    return swResult.ToString();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "TryBuildFromXsl failed for path {Path}.", xslPath);
                    return null;
                }
            }

            private static string BuildFallbackEmailHtml(Proposal proposal, string policyNumber) =>
                $@"<html><body>
                    <p>Dear {Escape(proposal.Name)},</p>
                    <p>Your Home Insurance policy <strong>{Escape(policyNumber)}</strong> has been issued successfully.</p>
                    <p>Please find your policy documents attached.</p>
                    <p>Thank you.</p>
                   </body></html>";

            private static byte[]? ZipPolicyDocuments(string storeDir)
            {
                if (!Directory.Exists(storeDir))
                    return null;

                var pdfFiles = Directory.GetFiles(storeDir, "*.pdf");
                if (pdfFiles.Length == 0)
                    return null;

                using var ms = new MemoryStream();
                using (var archive = new ZipArchive(ms, ZipArchiveMode.Create, leaveOpen: true))
                {
                    foreach (var file in pdfFiles)
                    {
                        var entryName = Path.GetFileName(file);
                        var entry     = archive.CreateEntry(entryName, CompressionLevel.Optimal);
                        using var entryStream = entry.Open();
                        using var fileStream  = File.OpenRead(file);
                        fileStream.CopyTo(entryStream);
                    }
                }
                return ms.ToArray();
            }

            private static string Escape(string? value) =>
                string.IsNullOrEmpty(value) ? string.Empty
                : value.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;");

            private static string MaskEmail(string? email)
            {
                if (string.IsNullOrEmpty(email)) return "***";
                var at = email.IndexOf('@');
                return at > 0 ? $"****@{email[(at + 1)..]}" : "***";
            }

            private static SendSalesEmailResult Fail(string message) =>
                new() { Succeeded = false, Message = message };
        }
    }

    public class SendSalesEmailResult
    {
        public bool   Succeeded { get; set; }
        public string Message   { get; set; } = string.Empty;
    }
}
