namespace ApplicationService.Core.Application.ProposalService.DTOs
{
    public class PDFStatusResponse
    {
        public bool    status      { get; set; }
        public string? ReferenceId { get; set; }
        public string? Token       { get; set; }
        public string  PDFFileName { get; set; } = string.Empty;
    }
}
