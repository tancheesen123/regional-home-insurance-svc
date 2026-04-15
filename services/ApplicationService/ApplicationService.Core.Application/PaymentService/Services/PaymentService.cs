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

        // Currency mapping per region
        private static readonly Dictionary<string, string> RegionCurrency =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["PH"] = "PHP",
                ["ID"] = "IDR",
                ["KH"] = "USD"
            };

        // Stripe minimum charge amounts per currency (in the currency's standard unit)
        // Reference: https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts
        private static readonly Dictionary<string, decimal> StripeMinimumAmount =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["USD"] = 0.50m,
                ["PHP"] = 20.00m,
                ["IDR"] = 1999m,
                ["MYR"] = 2.00m,
                ["SGD"] = 0.50m,
                ["EUR"] = 0.50m,
                ["GBP"] = 0.30m,
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

        public async Task<InitiatePaymentResponse> InitiatePaymentAsync(InitiatePaymentRequest request)
        {
            _logger.LogInformation("=== PaymentService.InitiatePaymentAsync ===");

            // ── Validate proposal ─────────────────────────────────────────────
            var proposal = await _proposalRepository.GetByIdAsync(request.ProposalId);
            if (proposal == null)
                throw new KeyNotFoundException($"Proposal '{request.ProposalId}' not found.");

            if (proposal.Status != "PENDING")
                throw new InvalidOperationException(
                    $"Proposal is in '{proposal.Status}' status. Only PENDING proposals can initiate payment.");

            // Guard against duplicate pending payment
            var existing = await _paymentRepository.GetByProposalIdAsync(request.ProposalId);
            if (existing.Any(p => p.Status == "PENDING"))
                throw new InvalidOperationException(
                    "A pending payment already exists for this proposal. Complete or cancel it first.");

            // ── Resolve currency ──────────────────────────────────────────────
            var region   = proposal.Quotation?.Region ?? "PH";
            var currency = RegionCurrency.GetValueOrDefault(region.ToUpper(), "USD");
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

        private async Task<PaymentCallbackResponse> HandleSessionCompletedAsync(Session? session)
        {
            if (session == null)
                throw new InvalidOperationException("Stripe session payload is null.");

            // Find Payment by the Stripe session ID stored in TransactionId
            var payment = await _paymentRepository.GetByTransactionIdAsync(session.Id);
            if (payment == null)
                throw new KeyNotFoundException($"No payment found for Stripe session '{session.Id}'.");

            // Update payment
            payment.Status        = "SUCCESS";
            payment.TransactionId = session.PaymentIntentId ?? session.Id;
            payment.UpdatedAt     = DateTime.UtcNow;
            _paymentRepository.UpdatePayment(payment);

            // Find and inforce the proposal
            var proposal = await _proposalRepository.GetByIdAsync(payment.ProposalId);
            if (proposal == null)
                throw new KeyNotFoundException($"Proposal '{payment.ProposalId}' not found.");

            if (proposal.Status == "INFORCED")
            {
                // Idempotency — Stripe may retry; return existing policy info
                await _paymentRepository.SaveChangesAsync();
                return new PaymentCallbackResponse
                {
                    PaymentId     = payment.PaymentId,
                    ReferenceNumber = payment.ReferenceNumber,
                    PaymentStatus = payment.Status,
                    ProposalId    = proposal.ProposalId,
                    ProposalStatus = proposal.Status,
                    Message       = "Payment already processed."
                };
            }

            // Build Policy
            var quotation  = proposal.Quotation;
            var policy     = new Policy
            {
                PolicyId       = Guid.NewGuid().ToString(),
                PolicyNumber   = GeneratePolicyNumber(quotation?.Region ?? "XX"),
                StartDate      = quotation?.CoverageStartDate ?? DateTime.UtcNow.Date,
                EndDate        = quotation?.ExpiryDate        ?? DateTime.UtcNow.Date.AddYears(1),
                CoverageAmount = quotation?.Premium * 100     ?? 0m,
                IssuedAt       = DateTime.UtcNow,
                IssuedBy       = "SYSTEM",
                ProposalId     = proposal.ProposalId,
                CreatedAt      = DateTime.UtcNow
            };

            // Atomic: inforce proposal + create policy + convert quotation
            await _proposalRepository.InforceProposalAsync(proposal, policy);
            await _proposalRepository.SaveChangesAsync();

            return new PaymentCallbackResponse
            {
                PaymentId      = payment.PaymentId,
                ReferenceNumber = payment.ReferenceNumber,
                PaymentStatus  = payment.Status,
                ProposalId     = proposal.ProposalId,
                ProposalStatus = "INFORCED",
                PolicyId       = policy.PolicyId,
                PolicyNumber   = policy.PolicyNumber,
                PolicyStartDate = policy.StartDate.ToString("dd/MM/yyyy"),
                PolicyEndDate   = policy.EndDate.ToString("dd/MM/yyyy"),
                Message        = "Payment successful. Policy has been inforced."
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

        public async Task<ConfirmPaymentResponse> ConfirmPaymentAsync(string sessionId)
        {
            _logger.LogInformation("=== PaymentService.ConfirmPaymentAsync | sessionId={SessionId} ===", sessionId);

            // ── Retrieve the Stripe session and verify it was actually paid ──
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

            // ── Find our local Payment record ─────────────────────────────────
            var payment = await _paymentRepository.GetByTransactionIdAsync(sessionId);
            if (payment == null)
                throw new KeyNotFoundException($"No payment found for Stripe session '{sessionId}'.");

            // ── Update Payment → SUCCESS immediately after Stripe confirms paid ─
            var alreadyProcessed  = payment.Status == "SUCCESS";
            payment.Status        = "SUCCESS";
            payment.TransactionId = stripeSession.PaymentIntentId ?? sessionId;
            payment.UpdatedAt     = DateTime.UtcNow;
            _paymentRepository.UpdatePayment(payment);
            await _paymentRepository.SaveChangesAsync();

            _logger.LogInformation("Payment {PaymentId} marked SUCCESS.", payment.PaymentId);

            // ── Idempotency — proposal already inforced on a previous redirect ─
            if (alreadyProcessed)
            {
                var proposal2    = await _proposalRepository.GetByIdAsync(payment.ProposalId);
                var policy2      = proposal2?.Policy;
                var frontendUrl2 = BuildFrontendSuccessUrl(payment.ReferenceNumber, policy2?.PolicyNumber);

                return new ConfirmPaymentResponse
                {
                    PaymentId       = payment.PaymentId,
                    ReferenceNumber = payment.ReferenceNumber,
                    PaymentStatus   = "SUCCESS",
                    ProposalId      = payment.ProposalId,
                    ProposalStatus  = proposal2?.Status ?? "INFORCED",
                    PolicyId        = policy2?.PolicyId,
                    PolicyNumber    = policy2?.PolicyNumber,
                    PolicyStartDate = policy2?.StartDate.ToString("dd/MM/yyyy"),
                    PolicyEndDate   = policy2?.EndDate.ToString("dd/MM/yyyy"),
                    RedirectUrl     = frontendUrl2,
                    Message         = "Payment already confirmed."
                };
            }

            // ── Load Proposal ─────────────────────────────────────────────────
            var proposal = await _proposalRepository.GetByIdAsync(payment.ProposalId);
            if (proposal == null)
                throw new KeyNotFoundException($"Proposal '{payment.ProposalId}' not found.");

            // Guard: proposal was already inforced by the webhook before the redirect arrived
            if (proposal.Status == "INFORCED")
            {
                var existingPolicy = proposal.Policy;
                var frontendUrl3   = BuildFrontendSuccessUrl(payment.ReferenceNumber, existingPolicy?.PolicyNumber);
                return new ConfirmPaymentResponse
                {
                    PaymentId       = payment.PaymentId,
                    ReferenceNumber = payment.ReferenceNumber,
                    PaymentStatus   = "SUCCESS",
                    ProposalId      = proposal.ProposalId,
                    ProposalStatus  = "INFORCED",
                    PolicyId        = existingPolicy?.PolicyId,
                    PolicyNumber    = existingPolicy?.PolicyNumber,
                    PolicyStartDate = existingPolicy?.StartDate.ToString("dd/MM/yyyy"),
                    PolicyEndDate   = existingPolicy?.EndDate.ToString("dd/MM/yyyy"),
                    RedirectUrl     = frontendUrl3,
                    Message         = "Payment confirmed. Policy already inforced."
                };
            }

            // ── Build Policy ──────────────────────────────────────────────────
            var quotation = proposal.Quotation;
            var policy    = new Policy
            {
                PolicyId       = Guid.NewGuid().ToString(),
                PolicyNumber   = GeneratePolicyNumber(quotation?.Region ?? "XX"),
                StartDate      = quotation?.CoverageStartDate ?? DateTime.UtcNow.Date,
                EndDate        = quotation?.ExpiryDate        ?? DateTime.UtcNow.Date.AddYears(1),
                CoverageAmount = quotation?.Premium * 100     ?? 0m,
                IssuedAt       = DateTime.UtcNow,
                IssuedBy       = "SYSTEM",
                ProposalId     = proposal.ProposalId,
                CreatedAt      = DateTime.UtcNow
            };

            // ── Atomic: inforce proposal + create policy + convert quotation ──
            await _proposalRepository.InforceProposalAsync(proposal, policy);
            await _proposalRepository.SaveChangesAsync();

            var frontendUrl = BuildFrontendSuccessUrl(payment.ReferenceNumber, policy.PolicyNumber);

            return new ConfirmPaymentResponse
            {
                PaymentId       = payment.PaymentId,
                ReferenceNumber = payment.ReferenceNumber,
                PaymentStatus   = "SUCCESS",
                ProposalId      = proposal.ProposalId,
                ProposalStatus  = "INFORCED",
                PolicyId        = policy.PolicyId,
                PolicyNumber    = policy.PolicyNumber,
                PolicyStartDate = policy.StartDate.ToString("dd/MM/yyyy"),
                PolicyEndDate   = policy.EndDate.ToString("dd/MM/yyyy"),
                RedirectUrl     = frontendUrl,
                Message         = "Payment confirmed. Policy has been inforced."
            };
        }

        private string BuildFrontendSuccessUrl(string referenceNumber, string? policyNumber)
        {
            var baseUrl = _stripeSettings.FrontendSuccessUrl;
            var url     = $"{baseUrl}?ref={Uri.EscapeDataString(referenceNumber)}";
            if (!string.IsNullOrEmpty(policyNumber))
                url += $"&policy={Uri.EscapeDataString(policyNumber)}";
            return url;
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        private static string GenerateReferenceNumber(string region)
        {
            var year     = DateTime.UtcNow.Year;
            var sequence = new Random().Next(100000, 999999);
            return $"PAY-{region.ToUpper()}-{year}-{sequence}";
        }

        private static string GeneratePolicyNumber(string region)
        {
            var year     = DateTime.UtcNow.Year;
            var sequence = new Random().Next(100000, 999999);
            return $"HI-{region.ToUpper()}-{year}-{sequence}";
        }
    }
}
