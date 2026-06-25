namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
    public interface IPdfService
    {
        Task<byte[]> HtmlToPdfAsync(string html, PdfMargin? margin = null);

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
