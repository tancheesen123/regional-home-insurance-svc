using ApplicationService.Core.Application.PaymentService.DTOs;
using Stripe;

namespace ApplicationService.Core.Application.PaymentService.Interfaces.Services
{
    public interface IStripeService
    {
        /// <summary>
        /// Creates a Stripe Checkout Session and returns the hosted payment URL.
        /// </summary>
        Task<StripeSessionDto> CreateCheckoutSessionAsync(
            string referenceNumber,
            string proposalId,
            string countryCode,
            decimal amount,
            string currency,
            string customerEmail,
            string productDescription);

        /// <summary>
        /// Verifies the Stripe-Signature header and deserialises the webhook payload.
        /// Throws <see cref="StripeException"/> when the signature is invalid.
        /// </summary>
        Event ConstructWebhookEvent(string json, string stripeSignatureHeader);

        /// <summary>
        /// Retrieves a Stripe Checkout Session by its ID.
        /// Used by the ConfirmPayment redirect endpoint to verify payment_status == "paid".
        /// </summary>
        Task<Stripe.Checkout.Session> GetSessionAsync(string sessionId);
    }
}
