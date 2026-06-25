namespace ApplicationService.Core.Application.ProposalService.Settings
{
    public class DocumentSettings
    {
        public string StoragePath { get; set; } = "wwwroot/documents";

        public string DocsPath { get; set; } = "Docs";

        public string BaseUrl { get; set; } = string.Empty;

        public string Entity { get; set; } = "EGIB";

        public int PdfRetryCount { get; set; } = 3;
    }
}
