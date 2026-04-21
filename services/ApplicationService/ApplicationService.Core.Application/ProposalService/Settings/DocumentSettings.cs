namespace ApplicationService.Core.Application.ProposalService.Settings
{
    public class DocumentSettings
    {
        /// <summary>Root path where generated PDFs are saved, e.g. "wwwroot/documents".</summary>
        public string StoragePath { get; set; } = "wwwroot/documents";

        /// <summary>Root path for XSL/email/SMS template files, e.g. "Docs".</summary>
        public string DocsPath { get; set; } = "Docs";

        /// <summary>Base URL used to build download links returned in the API response.</summary>
        public string BaseUrl { get; set; } = string.Empty;

        /// <summary>EGIB or EGTB — determines which entity-branded templates are used.</summary>
        public string Entity { get; set; } = "EGIB";

        /// <summary>Number of retry attempts for each PDF form generation (mirrors ConfigSettings.RetryAction).</summary>
        public int PdfRetryCount { get; set; } = 3;
    }
}
