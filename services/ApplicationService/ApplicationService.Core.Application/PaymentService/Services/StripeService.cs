using ApplicationService.Core.Application.PaymentService.DTOs;
using ApplicationService.Core.Application.PaymentService.Interfaces.Services;
using ApplicationService.Core.Application.PaymentService.Settings;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace ApplicationService.Core.Application.PaymentService.Services
{
    public class StripeService : IStripeService
    {
        private readonly StripeSettings _settings;

        // Currencies where Stripe expects the amount in the base unit (no x100)
        private static readonly HashSet<string> ZeroDecimalCurrencies = new(StringComparer.OrdinalIgnoreCase)
        {
            "BIF","CLP","DJF","GNF","IDR","JPY","KMF","KRW",
            "MGA","PYG","RWF","UGX","UYI","VND","VUV","XAF","XOF","XPF"
        };

        public StripeService(IOptions<StripeSettings> options)
        {
            _settings = options.Value;
            StripeConfiguration.ApiKey = _settings.SecretKey;
        }

        // ── CreateCheckoutSession ─────────────────────────────────────────────

        public async Task<StripeSessionDto> CreateCheckoutSessionAsync(
            string referenceNumber,
            string proposalId,
            string countryCode,
            decimal amount,
            string currency,
            string customerEmail,
            string productDescription)
        {
            // Stripe amounts are in the smallest currency unit.
            // Zero-decimal currencies (e.g. IDR) are passed as-is; others are multiplied by 100.
            var unitAmount = ZeroDecimalCurrencies.Contains(currency)
                ? (long)Math.Round(amount, 0)
                : (long)Math.Round(amount * 100, 0);

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                Mode               = "payment",

                LineItems = new List<SessionLineItemOptions>
                {
                    new()
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency    = currency.ToLower(),
                            UnitAmount  = unitAmount,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name        = productDescription,
                                Description = $"Reference: {referenceNumber}"
                            }
                        },
                        Quantity = 1
                    }
                },

                // Stripe replaces {CHECKOUT_SESSION_ID} in the URL.
                // countryCode is embedded so DbContextResolver can resolve the correct DB on redirect.
                SuccessUrl = $"{_settings.SuccessUrl}?countryCode={countryCode}&session_id={{CHECKOUT_SESSION_ID}}&ref={referenceNumber}",
                CancelUrl  = $"{_settings.CancelUrl}?ref={referenceNumber}",

                // Pre-fill the email field on the Stripe-hosted page
                CustomerEmail = customerEmail,

                // Metadata — available in dashboard and webhook payload
                Metadata = new Dictionary<string, string>
                {
                    ["referenceNumber"] = referenceNumber,
                    ["proposalId"]      = proposalId
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            return new StripeSessionDto
            {
                SessionId   = session.Id,
                CheckoutUrl = session.Url
            };
        }

        // ── ConstructWebhookEvent ─────────────────────────────────────────────

        public Event ConstructWebhookEvent(string json, string stripeSignatureHeader)
        {
            // Throws StripeException when signature does not match
            return EventUtility.ConstructEvent(
                json,
                stripeSignatureHeader,
                _settings.WebhookSecret,
                throwOnApiVersionMismatch: false);
        }

        // ── GetSession ────────────────────────────────────────────────────────

        public async Task<Session> GetSessionAsync(string sessionId)
        {
            var service = new SessionService();
            return await service.GetAsync(sessionId);
        }
    }
}
