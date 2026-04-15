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
        public string? GatewayName { get; set; }    // "Stripe"

        /// <summary>
        /// Stripe Checkout Session details.
        /// Redirect the customer to StripeSession.CheckoutUrl to complete payment.
        /// </summary>
        public StripeSessionDto StripeSession { get; set; }

        public string Status { get; set; }     // "PENDING"
        public string ExpiresAt { get; set; }  // dd/MM/yyyy HH:mm:ss (UTC)
        public string Message { get; set; }
    }
}
