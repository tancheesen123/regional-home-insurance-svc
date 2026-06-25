namespace ApplicationService.Core.Application.PaymentService.DTOs
{
    public class StripeSessionDto
    {
        public string SessionId { get; set; }

        public string CheckoutUrl { get; set; }
    }
}
