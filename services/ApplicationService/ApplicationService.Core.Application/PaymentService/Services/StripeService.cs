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


        public async Task<StripeSessionDto> CreateCheckoutSessionAsync(
            string referenceNumber,
            string proposalId,
            string countryCode,
            decimal amount,
            string currency,
            string customerEmail,
            string productDescription)
        {
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

                SuccessUrl = $"{_settings.SuccessUrl}?countryCode={countryCode}&session_id={{CHECKOUT_SESSION_ID}}&ref={referenceNumber}",
                CancelUrl  = $"{_settings.CancelUrl}?ref={referenceNumber}&reason=cancelled",

                CustomerEmail = customerEmail,

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


        public Event ConstructWebhookEvent(string json, string stripeSignatureHeader)
        {
            return EventUtility.ConstructEvent(
                json,
                stripeSignatureHeader,
                _settings.WebhookSecret,
                throwOnApiVersionMismatch: false);
        }


        public async Task<Session> GetSessionAsync(string sessionId)
        {
            var service = new SessionService();
            return await service.GetAsync(sessionId);
        }
    }
}
