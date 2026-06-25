using ApplicationService.Core.Application.PaymentService.DTOs;
using Stripe;

namespace ApplicationService.Core.Application.PaymentService.Interfaces.Services
{
    public interface IStripeService
    {
        Task<StripeSessionDto> CreateCheckoutSessionAsync(
            string referenceNumber,
            string proposalId,
            string countryCode,
            decimal amount,
            string currency,
            string customerEmail,
            string productDescription);

        Event ConstructWebhookEvent(string json, string stripeSignatureHeader);

        Task<Stripe.Checkout.Session> GetSessionAsync(string sessionId);
    }
}
