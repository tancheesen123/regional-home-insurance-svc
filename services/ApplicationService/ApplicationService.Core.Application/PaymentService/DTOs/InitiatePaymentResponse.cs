namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class InitiatePaymentResponse
    {
        public string PaymentId { get; set; }
        public string ReferenceNumber { get; set; }
        public string ProposalId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string PaymentMethod { get; set; }
        public string? GatewayName { get; set; }

        public StripeSessionDto StripeSession { get; set; }

        public string Status { get; set; }
        public string ExpiresAt { get; set; }
        public string Message { get; set; }
    }
}
