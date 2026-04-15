namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class ConfirmPaymentResponse
    {
        public string PaymentId { get; set; } = string.Empty;
        public string ReferenceNumber { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;   // "SUCCESS"

        public string ProposalId { get; set; } = string.Empty;
        public string ProposalStatus { get; set; } = string.Empty;  // "INFORCED"

        public string? PolicyId { get; set; }
        public string? PolicyNumber { get; set; }
        public string? PolicyStartDate { get; set; }
        public string? PolicyEndDate { get; set; }

        /// <summary>Frontend URL the browser should be redirected to.</summary>
        public string RedirectUrl { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
    }
}
