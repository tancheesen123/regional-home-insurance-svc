namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    /// <summary>
    /// Stripe Checkout Session details returned to the frontend.
    /// Redirect the customer to <see cref="CheckoutUrl"/> to complete payment.
    /// </summary>
    public class StripeSessionDto
    {
        /// <summary>Stripe Checkout Session ID (cs_xxx). Store this to match the webhook later.</summary>
        public string SessionId { get; set; }

        /// <summary>Hosted Stripe payment page — redirect the customer here.</summary>
        public string CheckoutUrl { get; set; }
    }
}
