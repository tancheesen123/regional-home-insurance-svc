using ApplicationService.Core.Application.PaymentService.DTOs;
using ApplicationService.Core.Application.PaymentService.Interfaces.Repositories;
using ApplicationService.Core.Application.PaymentService.Interfaces.Services;
using ApplicationService.Core.Application.PaymentService.Settings;
using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace ApplicationService.Core.Application.PaymentService.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ILogger<PaymentService> _logger;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IProposalRepository _proposalRepository;
        private readonly IStripeService _stripeService;
        private readonly StripeSettings _stripeSettings;

        private static readonly Dictionary<string, string> RegionCurrency =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["PH"] = "PHP",   // Philippine Peso
                ["ID"] = "IDR",   // Indonesian Rupiah
                ["KH"] = "USD",   // Cambodia transacts in USD
            };

        // Stripe minimum charge amounts per currency (in the currency's standard unit)
        // Reference: https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts
        private static readonly Dictionary<string, decimal> StripeMinimumAmount =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["USD"] = 0.50m,
                ["PHP"] = 20.00m,
                ["IDR"] = 1999m,
            };

        // Stripe checkout session lasts 24 h; we mirror that locally
        private const int PaymentSessionMinutes = 1440;

        public PaymentService(
            ILogger<PaymentService> logger,
            IPaymentRepository paymentRepository,
            IProposalRepository proposalRepository,
            IStripeService stripeService,
            IOptions<StripeSettings> stripeOptions)
        {
            _logger = logger;
            _paymentRepository = paymentRepository;
            _proposalRepository = proposalRepository;
            _stripeService = stripeService;
            _stripeSettings = stripeOptions.Value;
        }

        // ── InitiatePayment ───────────────────────────────────────────────────

        public async Task<InitiatePaymentResponse> InitiatePaymentAsync(InitiatePaymentRequest request, string region)
        {
            _logger.LogInformation("=== PaymentService.InitiatePaymentAsync | Region={Region} ===", region);

            // ── Validate region ───────────────────────────────────────────────
            region = region.ToUpper();
            if (!RegionCurrency.ContainsKey(region))
                throw new InvalidOperationException(
                    $"Unsupported region '{region}'. Valid values: {string.Join(", ", RegionCurrency.Keys)}.");

            // ── Validate proposal ─────────────────────────────────────────────
            var proposal = await _proposalRepository.GetByIdAsync(request.ProposalId);
            if (proposal == null)
                throw new KeyNotFoundException($"Proposal '{request.ProposalId}' not found.");

            // Ensure the header region matches the proposal's stored region
            var proposalRegion = proposal.Quotation?.Region?.ToUpper() ?? region;
            if (!string.Equals(proposalRegion, region, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException(
                    $"Region mismatch: header says '{region}' but proposal belongs to region '{proposalRegion}'. " +
                    "Send the correct X-Country-Code header.");

            if (proposal.Status != "PENDING")
                throw new InvalidOperationException(
                    $"Proposal is in '{proposal.Status}' status. Only PENDING proposals can initiate payment.");

            // Guard against duplicate pending payment
            var existing = await _paymentRepository.GetByProposalIdAsync(request.ProposalId);
            if (existing.Any(p => p.Status == "PENDING"))
                throw new InvalidOperationException(
                    "A pending payment already exists for this proposal. Complete or cancel it first.");

            // ── Resolve currency from region ──────────────────────────────────
            var currency = RegionCurrency[region];
            var amount   = proposal.Quotation?.Premium ?? 0m;

            // ── Validate Stripe minimum charge ────────────────────────────────
            if (StripeMinimumAmount.TryGetValue(currency, out var minAmount) && amount < minAmount)
                throw new InvalidOperationException(
                    $"Premium amount {amount:F2} {currency} is below Stripe's minimum charge of {minAmount:F2} {currency} for this currency. " +
                    $"Please review the quotation premium.");

            // ── Create Stripe Checkout Session ────────────────────────────────
            var referenceNum = GenerateReferenceNumber(region);

            var stripeSession = await _stripeService.CreateCheckoutSessionAsync(
                referenceNumber:    referenceNum,
                proposalId:         request.ProposalId,
                countryCode:        region,
                amount:             amount,
                currency:           currency,
                customerEmail:      proposal.Email ?? string.Empty,
                productDescription: "Home Insurance Premium");

            // ── Persist Payment record ────────────────────────────────────────
            var now       = DateTime.UtcNow;
            var expiresAt = now.AddMinutes(PaymentSessionMinutes);

            var payment = new Payment
            {
                PaymentId       = Guid.NewGuid().ToString(),
                ReferenceNumber = referenceNum,
                Amount          = amount,
                Currency        = currency,
                Status          = "PENDING",
                PaymentMethod   = request.PaymentMethod,
                GatewayName     = null,                      // no PaymentGateway row for Stripe
                TransactionId   = stripeSession.SessionId,  // Stripe session ID stored here
                PaymentUrl      = stripeSession.CheckoutUrl,
                ExpiresAt       = expiresAt,
                PaymentDate     = now,
                ProposalId      = request.ProposalId,
                CreatedAt       = now
            };

            await _paymentRepository.AddPaymentAsync(payment);
            await _paymentRepository.SaveChangesAsync();

            return new InitiatePaymentResponse
            {
                PaymentId       = payment.PaymentId,
                ReferenceNumber = payment.ReferenceNumber,
                ProposalId      = payment.ProposalId,
                Amount          = payment.Amount,
                Currency        = payment.Currency,
                PaymentMethod   = payment.PaymentMethod,
                GatewayName     = "Stripe",
                StripeSession   = stripeSession,
                Status          = payment.Status,
                ExpiresAt       = expiresAt.ToString("dd/MM/yyyy HH:mm:ss"),
                Message         = "Stripe payment initiated. Redirect the customer to StripeSession.CheckoutUrl."
            };
        }

        // ── HandleCallback ────────────────────────────────────────────────────

        public async Task<PaymentCallbackResponse> HandleCallbackAsync(string json, string stripeSignature)
        {
            _logger.LogInformation("=== PaymentService.HandleCallbackAsync ===");

            // ── Verify Stripe signature ───────────────────────────────────────
            Event stripeEvent;
            try
            {
                stripeEvent = _stripeService.ConstructWebhookEvent(json, stripeSignature);
            }
            catch (StripeException ex)
            {
                _logger.LogWarning("Stripe webhook signature verification failed: {Message}", ex.Message);
                throw new UnauthorizedAccessException("Invalid Stripe webhook signature.");
            }

            _logger.LogInformation("Stripe event received: {Type}", stripeEvent.Type);

            return stripeEvent.Type switch
            {
                "checkout.session.completed" =>
                    await HandleSessionCompletedAsync(stripeEvent.Data.Object as Session),

                "checkout.session.expired" =>
                    await HandleSessionExpiredAsync(stripeEvent.Data.Object as Session),

                // Return a neutral response for unhandled event types — always 200 to Stripe
                _ => new PaymentCallbackResponse
                {
                    Message = $"Event '{stripeEvent.Type}' received but not handled."
                }
            };
        }

        // ── checkout.session.completed ────────────────────────────────────────
        // Only updates the payment record to SUCCESS.
        // Policy creation / proposal inforce is handled by the dedicated InforcePolicy API.

        private async Task<PaymentCallbackResponse> HandleSessionCompletedAsync(Session? session)
        {
            if (session == null)
                throw new InvalidOperationException("Stripe session payload is null.");

            var payment = await _paymentRepository.GetByTransactionIdAsync(session.Id);
            if (payment == null)
                throw new KeyNotFoundException($"No payment found for Stripe session '{session.Id}'.");

            if (payment.Status == "SUCCESS")
            {
                // Idempotency — Stripe may retry
                return new PaymentCallbackResponse
                {
                    PaymentId       = payment.PaymentId,
                    ReferenceNumber = payment.ReferenceNumber,
                    PaymentStatus   = payment.Status,
                    ProposalId      = payment.ProposalId,
                    Message         = "Payment already marked as SUCCESS."
                };
            }

            payment.Status        = "SUCCESS";
            payment.TransactionId = session.PaymentIntentId ?? session.Id;
            payment.UpdatedAt     = DateTime.UtcNow;
            _paymentRepository.UpdatePayment(payment);
            await _paymentRepository.SaveChangesAsync();

            _logger.LogInformation("Webhook: Payment {PaymentId} marked SUCCESS.", payment.PaymentId);

            return new PaymentCallbackResponse
            {
                PaymentId       = payment.PaymentId,
                ReferenceNumber = payment.ReferenceNumber,
                PaymentStatus   = "SUCCESS",
                ProposalId      = payment.ProposalId,
                Message         = "Payment marked SUCCESS. Call InforcePolicy API to issue the policy."
            };
        }

        // ── checkout.session.expired ──────────────────────────────────────────

        private async Task<PaymentCallbackResponse> HandleSessionExpiredAsync(Session? session)
        {
            if (session == null)
                throw new InvalidOperationException("Stripe session payload is null.");

            var payment = await _paymentRepository.GetByTransactionIdAsync(session.Id);
            if (payment == null)
                throw new KeyNotFoundException($"No payment found for Stripe session '{session.Id}'.");

            payment.Status    = "EXPIRED";
            payment.UpdatedAt = DateTime.UtcNow;
            _paymentRepository.UpdatePayment(payment);
            await _paymentRepository.SaveChangesAsync();

            return new PaymentCallbackResponse
            {
                PaymentId       = payment.PaymentId,
                ReferenceNumber = payment.ReferenceNumber,
                PaymentStatus   = "EXPIRED",
                ProposalId      = payment.ProposalId,
                Message         = "Stripe checkout session expired. Customer must initiate payment again."
            };
        }

        // ── ConfirmPayment ────────────────────────────────────────────────────
        // Verifies the Stripe session was paid, then updates Payment → SUCCESS.
        // Policy creation and proposal inforce is handled by the InforcePolicy API.

        public async Task<ConfirmPaymentResponse> ConfirmPaymentAsync(string sessionId)
        {
            _logger.LogInformation("=== PaymentService.ConfirmPaymentAsync | SessionId={SessionId} ===", sessionId);

            // ── Verify with Stripe that the session was actually paid ─────────
            Stripe.Checkout.Session stripeSession;
            try
            {
                stripeSession = await _stripeService.GetSessionAsync(sessionId);
            }
            catch (Stripe.StripeException ex)
            {
                _logger.LogWarning("Stripe GetSession failed: {Message}", ex.Message);
                throw new InvalidOperationException($"Could not retrieve Stripe session: {ex.Message}");
            }

            if (stripeSession.PaymentStatus != "paid")
                throw new InvalidOperationException(
                    $"Stripe session payment_status is '{stripeSession.PaymentStatus}'. Payment not yet completed.");

            // ── Find local Payment record ─────────────────────────────────────
            var payment = await _paymentRepository.GetByTransactionIdAsync(sessionId);
            if (payment == null)
                throw new KeyNotFoundException($"No payment found for Stripe session '{sessionId}'.");

            // ── Update Payment → SUCCESS (idempotent) ─────────────────────────
            payment.Status        = "SUCCESS";
            payment.TransactionId = stripeSession.PaymentIntentId ?? sessionId;
            payment.UpdatedAt     = DateTime.UtcNow;
            _paymentRepository.UpdatePayment(payment);
            await _paymentRepository.SaveChangesAsync();

            _logger.LogInformation("Payment {PaymentId} marked SUCCESS.", payment.PaymentId);

            var redirectUrl = BuildFrontendSuccessUrl(payment.ReferenceNumber);

            return new ConfirmPaymentResponse
            {
                PaymentId       = payment.PaymentId,
                ReferenceNumber = payment.ReferenceNumber,
                PaymentStatus   = "SUCCESS",
                ProposalId      = payment.ProposalId,
                RedirectUrl     = redirectUrl,
                Message         = "Payment confirmed. Call InforcePolicy API to issue the policy."
            };
        }

        private string BuildFrontendSuccessUrl(string referenceNumber)
        {
            var baseUrl = _stripeSettings.FrontendSuccessUrl;
            return $"{baseUrl}?ref={Uri.EscapeDataString(referenceNumber)}&status=paid";
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        private static string GenerateReferenceNumber(string region)
        {
            var year     = DateTime.UtcNow.Year;
            var sequence = new Random().Next(100000, 999999);
            return $"PAY-{region.ToUpper()}-{year}-{sequence}";
        }

    }
}
