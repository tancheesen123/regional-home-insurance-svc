namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class PaymentCallbackResponse
    {
        public string PaymentId { get; set; }
        public string ReferenceNumber { get; set; }
        public string PaymentStatus { get; set; }   // "SUCCESS" | "FAILED" | "EXPIRED"

        public string? ProposalId { get; set; }
        public string? ProposalStatus { get; set; } // "INFORCED" when payment succeeds

        public string? PolicyId { get; set; }
        public string? PolicyNumber { get; set; }
        public string? PolicyStartDate { get; set; }
        public string? PolicyEndDate { get; set; }

        public string Message { get; set; }
    }
}
