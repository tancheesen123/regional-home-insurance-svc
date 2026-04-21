namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
    /// <summary>
    /// Converts HTML content to a PDF byte array.
    /// Implement with DinkToPdf, WkHtmlToPdf, Playwright, or similar.
    /// </summary>
    public interface IPdfService
    {
        Task<byte[]> HtmlToPdfAsync(string html, PdfMargin? margin = null);
    }

    public class PdfMargin
    {
        public int Top    { get; set; } = 10;
        public int Left   { get; set; } = 0;
        public int Right  { get; set; } = 0;
        public int Bottom { get; set; } = 0;
    }
}
