using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Policy : TransactionBaseEntity
    {
        public string PolicyId { get; set; }
        public string PolicyNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal CoverageAmount { get; set; }
        public DateTime IssuedAt { get; set; }
        public string IssuedBy { get; set; }
        public string ProposalId { get; set; }

        /// <summary>True once all policy PDF documents (ePolicy, Tax Invoice, PDS) have been generated.</summary>
        public bool HasFullDocument { get; set; } = false;

        /// <summary>
        /// Policy documents serialised as JSON array — replaces PolicyDocument table.
        /// Shape: [{ "documentId": "...", "fileName": "...", "fileUrl": "...", "fileType": "PDS", "uploadedAt": "..." }]
        /// </summary>
        public string? DocumentsJson { get; set; }

        // Navigation
        public Proposal Proposal { get; set; }
    }
}
