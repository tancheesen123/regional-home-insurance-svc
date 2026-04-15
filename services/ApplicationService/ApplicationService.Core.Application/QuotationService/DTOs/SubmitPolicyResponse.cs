namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class SubmitPolicyResponse
    {
        public string PolicyId { get; set; }
        public string PolicyNumber { get; set; }
        public string ProposalId { get; set; }
        public string QuotationId { get; set; }
        public decimal Premium { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
    }
}
