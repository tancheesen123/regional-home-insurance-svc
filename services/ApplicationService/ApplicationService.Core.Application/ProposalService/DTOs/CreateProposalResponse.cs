namespace ApplicationService.Core.Application.ProposalService.DTOs
{
    public class CreateProposalResponse
    {
        public string ProposalId { get; set; }
        public string QuotationId { get; set; }
        public string Status { get; set; }          // "PENDING"
        public string QuotationStatus { get; set; } // "LOCKED"
        public decimal Premium { get; set; }
        public string CoverageStartDate { get; set; }
        public string ExpiryDate { get; set; }
        public string Message { get; set; }
    }
}
