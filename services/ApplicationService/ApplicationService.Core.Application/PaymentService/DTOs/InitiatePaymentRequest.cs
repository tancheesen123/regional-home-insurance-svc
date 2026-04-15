namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class InitiatePaymentRequest
    {
        public string ProposalId { get; set; }

        /// <summary>
        /// Payment method label stored for reference.
        /// Stripe handles the actual method selection on its hosted page.
        /// Common values: "card" | "online-banking"
        /// </summary>
        public string PaymentMethod { get; set; } = "card";
    }
}
