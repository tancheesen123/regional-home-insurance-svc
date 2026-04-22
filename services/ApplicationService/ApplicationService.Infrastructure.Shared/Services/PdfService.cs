using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using DinkToPdf;
using DinkToPdf.Contracts;
using iText.Kernel.Pdf;
using Microsoft.Extensions.Logging;
using System.Text;

namespace ApplicationService.Infrastructure.Shared.Services
{
    /// <summary>
    /// HTML-to-PDF conversion using DinkToPdf (wkhtmltopdf wrapper).
    ///
    /// IMPORTANT — native library setup:
    ///   Windows : copy libwkhtmltox.dll (64-bit) next to the published executable.
    ///   Linux   : copy libwkhtmltox.so  next to the published executable.
    ///   Download from https://github.com/wkhtmltopdf/wkhtmltopdf/releases
    ///   or use the helper loader below (CustomAssemblyLoadContext) if needed.
    ///
    /// DI registration: MUST be Singleton — SynchronizedConverter is not scoped-safe.
    /// </summary>
    public class PdfService : IPdfService
    {
        private readonly IConverter          _converter;
        private readonly ILogger<PdfService> _logger;

        public PdfService(IConverter converter, ILogger<PdfService> logger)
        {
            _converter = converter;
            _logger    = logger;
        }

        public Task<byte[]> HtmlToPdfAsync(string html, PdfMargin? margin = null)
        {
            _logger.LogInformation(
                "PdfService.HtmlToPdfAsync | HtmlLength={Length} Margin={Top},{Left},{Right},{Bottom}",
                html.Length,
                margin?.Top    ?? 10,
                margin?.Left   ?? 0,
                margin?.Right  ?? 0,
                margin?.Bottom ?? 0);

            var doc = new HtmlToPdfDocument
            {
                GlobalSettings = new GlobalSettings
                {
                    ColorMode   = ColorMode.Color,
                    Orientation = Orientation.Portrait,
                    PaperSize   = PaperKind.A4,
                    Margins     = new MarginSettings
                    {
                        Top    = margin?.Top    ?? 10,
                        Left   = margin?.Left   ?? 0,
                        Right  = margin?.Right  ?? 0,
                        Bottom = margin?.Bottom ?? 0,
                        Unit   = Unit.Millimeters
                    }
                },
                Objects =
                {
                    new ObjectSettings
                    {
                        PagesCount  = true,
                        HtmlContent = html,
                        WebSettings = { DefaultEncoding = "utf-8" }
                    }
                }
            };

            var pdfBytes = _converter.Convert(doc);
            return Task.FromResult(pdfBytes);
        }

        /// <inheritdoc />
        public byte[] EncryptPdf(byte[] pdfBytes, string password)
        {
            try
            {
                var userPwd  = Encoding.UTF8.GetBytes(password);
                // Owner password is randomised — prevents the document being modified without iText
                var ownerPwd = Encoding.UTF8.GetBytes(Guid.NewGuid().ToString("N"));

                var writerProps = new WriterProperties()
                    .SetStandardEncryption(
                        userPwd,
                        ownerPwd,
                        EncryptionConstants.ALLOW_PRINTING | EncryptionConstants.ALLOW_COPY,
                        EncryptionConstants.ENCRYPTION_AES_128);

                using var input  = new MemoryStream(pdfBytes);
                using var output = new MemoryStream();
                using var reader = new PdfReader(input);
                using var writer = new PdfWriter(output, writerProps);
                using var pdf    = new PdfDocument(reader, writer);
                pdf.Close();

                _logger.LogInformation("PdfService.EncryptPdf | EncryptedSize={Size}", output.Length);
                return output.ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "PdfService.EncryptPdf failed — returning unencrypted PDF.");
                return pdfBytes;
            }
        }
    }
}
