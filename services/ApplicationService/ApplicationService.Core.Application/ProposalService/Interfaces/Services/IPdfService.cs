namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
    /// <summary>
    /// Converts HTML content to a PDF byte array and handles PDF post-processing.
    /// Implement with DinkToPdf, WkHtmlToPdf, Playwright, or similar.
    /// </summary>
    public interface IPdfService
    {
        Task<byte[]> HtmlToPdfAsync(string html, PdfMargin? margin = null);

        /// <summary>
        /// Applies AES-128 password encryption to a PDF byte array.
        /// The user password is required to open the document.
        /// Falls back to returning the original bytes if encryption fails.
        /// </summary>
        byte[] EncryptPdf(byte[] pdfBytes, string password);
    }

    public class PdfMargin
    {
        public int Top    { get; set; } = 10;
        public int Left   { get; set; } = 0;
        public int Right  { get; set; } = 0;
        public int Bottom { get; set; } = 0;
    }
}
