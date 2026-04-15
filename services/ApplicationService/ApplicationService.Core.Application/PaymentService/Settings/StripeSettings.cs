namespace ApplicationService.Core.Application.PaymentService.Settings
{
    public class StripeSettings
    {
        /// <summary>Secret key from Stripe dashboard (starts with sk_test_ or sk_live_).</summary>
        public string SecretKey { get; set; } = string.Empty;

        /// <summary>Publishable key — safe to expose to the frontend.</summary>
        public string PublishableKey { get; set; } = string.Empty;

        /// <summary>
        /// Webhook signing secret from Stripe dashboard (starts with whsec_).
        /// Used in Step 7 to verify the callback is genuinely from Stripe.
        /// </summary>
        public string WebhookSecret { get; set; } = string.Empty;

        /// <summary>
        /// Backend endpoint Stripe redirects to after successful payment.
        /// This endpoint confirms the session with Stripe, updates statuses,
        /// then redirects to FrontendSuccessUrl.
        /// Example: https://localhost:44337/api/payment/ConfirmPayment
        /// </summary>
        public string SuccessUrl { get; set; } = string.Empty;

        /// <summary>Frontend URL the customer lands on after confirmation is complete.</summary>
        public string FrontendSuccessUrl { get; set; } = string.Empty;

        /// <summary>Frontend URL Stripe redirects to when the customer cancels.</summary>
        public string CancelUrl { get; set; } = string.Empty;
    }
}
