namespace ApplicationService.Core.Application.PaymentService.Settings
{
    public class StripeSettings
    {
        public string SecretKey { get; set; } = string.Empty;

        public string PublishableKey { get; set; } = string.Empty;

        public string WebhookSecret { get; set; } = string.Empty;

        public string SuccessUrl { get; set; } = string.Empty;

        public string FrontendSuccessUrl { get; set; } = string.Empty;

        public string CancelUrl { get; set; } = string.Empty;
    }
}
