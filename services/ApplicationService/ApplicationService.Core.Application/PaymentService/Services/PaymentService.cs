using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
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
using System.Security.Claims;

namespace ApplicationService.Core.Application.PaymentService.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ILogger<PaymentService> _logger;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IProposalRepository _proposalRepository;
        private readonly IStripeService _stripeService;
        private readonly StripeSettings _stripeSettings;
        private readonly IInforcePolicyService _inforcePolicyService;

        private static readonly Dictionary<string, string> RegionCurrency =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["PH"] = "PHP",
                ["ID"] = "IDR",
                ["KH"] = "USD",
            };

        private static readonly Dictionary<string, decimal> StripeMinimumAmount =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["USD"] = 0.50m,
                ["PHP"] = 20.00m,
                ["IDR"] = 1999m,
            };

        private const int PaymentSessionMinutes = 1440;

        public PaymentService(
            ILogger<PaymentService> logger,
            IPaymentRepository paymentRepository,
            IProposalRepository proposalRepository,
            IStripeService stripeService,
            IOptions<StripeSettings> stripeOptions,
            IInforcePolicyService inforcePolicyService)
        {
            _logger = logger;
            _paymentRepository = paymentRepository;
            _proposalRepository = proposalRepository;
            _stripeService = stripeService;
            _stripeSettings = stripeOptions.Value;
            _inforcePolicyService = inforcePolicyService;
        }


        public async Task<InitiatePaymentResponse> InitiatePaymentAsync(InitiatePaymentRequest request, string region)
        {
            _logger.LogInformation("=== PaymentService.InitiatePaymentAsync | Region={Region} ===", region);

            region = region.ToUpper();
            if (!RegionCurrency.ContainsKey(region))
                throw new InvalidOperationException(
                    $"Unsupported region '{region}'. Valid values: {string.Join(", ", RegionCurrency.Keys)}.");

            var proposal = await _proposalRepository.GetByIdAsync(request.ProposalId);
            if (proposal == null)
                throw new KeyNotFoundException($"Proposal '{request.ProposalId}' not found.");

            var proposalRegion = proposal.Quotation?.Region?.ToUpper() ?? region;
            if (!string.Equals(proposalRegion, region, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException(
                    $"Region mismatch: header says '{region}' but proposal belongs to region '{proposalRegion}'. " +
                    "Send the correct X-Country-Code header.");

            if (proposal.Status != "PENDING")
                throw new InvalidOperationException(
                    $"Proposal is in '{proposal.Status}' status. Only PENDING proposals can initiate payment.");

            var existing = await _paymentRepository.GetByProposalIdAsync(request.ProposalId);
            if (existing.Any(p => p.Status == "PENDING"))
                throw new InvalidOperationException(
                    "A pending payment already exists for this proposal. Complete or cancel it first.");

            var currency = RegionCurrency[region];
            var amount   = proposal.Quotation?.Premium ?? 0m;

            if (StripeMinimumAmount.TryGetValue(currency, out var minAmount) && amount < minAmount)
                throw new InvalidOperationException(
                    $"Premium amount {amount:F2} {currency} is below Stripe's minimum charge of {minAmount:F2} {currency} for this currency. " +
                    $"Please review the quotation premium.");

            var referenceNum = GenerateReferenceNumber(region);

            var stripeSession = await _stripeService.CreateCheckoutSessionAsync(
                referenceNumber:    referenceNum,
                proposalId:         request.ProposalId,
                countryCode:        region,
                amount:             amount,
                currency:           currency,
                customerEmail:      proposal.Email ?? string.Empty,
                productDescription: "Home Insurance Premium");

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
                GatewayName     = null,
                TransactionId   = stripeSession.SessionId,
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


        public async Task<PaymentCallbackResponse> HandleCallbackAsync(string json, string stripeSignature)
        {
            _logger.LogInformation("=== PaymentService.HandleCallbackAsync ===");

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

                _ => new PaymentCallbackResponse
                {
                    Message = $"Event '{stripeEvent.Type}' received but not handled."
                }
            };
        }


        private async Task<PaymentCallbackResponse> HandleSessionCompletedAsync(Session? session)
        {
            if (session == null)
                throw new InvalidOperationException("Stripe session payload is null.");

            var payment = await _paymentRepository.GetByTransactionIdAsync(session.Id);
            if (payment == null)
                throw new KeyNotFoundException($"No payment found for Stripe session '{session.Id}'.");

            if (payment.Status == "SUCCESS")
            {
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


        public async Task<ConfirmPaymentResponse> ConfirmPaymentAsync(string sessionId)
        {
            _logger.LogInformation("=== PaymentService.ConfirmPaymentAsync | SessionId={SessionId} ===", sessionId);

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

            var payment = await _paymentRepository.GetByTransactionIdAsync(sessionId);
            if (payment == null)
                throw new KeyNotFoundException($"No payment found for Stripe session '{sessionId}'.");

            payment.Status        = "SUCCESS";
            payment.TransactionId = stripeSession.PaymentIntentId ?? sessionId;
            payment.UpdatedAt     = DateTime.UtcNow;
            _paymentRepository.UpdatePayment(payment);
            await _paymentRepository.SaveChangesAsync();

            _logger.LogInformation("Payment {PaymentId} marked SUCCESS for ProposalId={ProposalId}.",
                payment.PaymentId, payment.ProposalId);

            var policyId     = string.Empty;
            var policyNumber = string.Empty;
            var inforceMsg   = string.Empty;

            try
            {
                var inforceRequest = new InforcePolicyRequest
                {
                    ProposalId    = payment.ProposalId,
                    SendEmail     = true,
                    SendSms       = null,
                    CheckPayment  = false,
                    WithUrlLink   = false
                };

                var systemPrincipal = new ClaimsPrincipal(new ClaimsIdentity());

                var inforceResult = await _inforcePolicyService.InforcePolicyAsync(
                    inforceRequest, systemPrincipal);

                policyId     = inforceResult.PolicyId;
                policyNumber = inforceResult.PolicyNumber;
                inforceMsg   = inforceResult.AlreadyInforced
                    ? "Policy already inforced."
                    : "Policy issued successfully.";

                _logger.LogInformation(
                    "InforcePolicy completed | ProposalId={ProposalId} PolicyNumber={PolicyNumber} AlreadyInforced={AlreadyInforced}",
                    payment.ProposalId, policyNumber, inforceResult.AlreadyInforced);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "InforcePolicy FAILED after successful payment | ProposalId={ProposalId} PaymentId={PaymentId}",
                    payment.ProposalId, payment.PaymentId);
                inforceMsg = "Payment confirmed. Policy issuance pending — please contact support if not received.";
            }

            var redirectUrl = BuildFrontendSuccessUrl(payment.ReferenceNumber, policyNumber);

            return new ConfirmPaymentResponse
            {
                PaymentId       = payment.PaymentId,
                ReferenceNumber = payment.ReferenceNumber,
                PaymentStatus   = "SUCCESS",
                ProposalId      = payment.ProposalId,
                PolicyId        = policyId,
                PolicyNumber    = policyNumber,
                RedirectUrl     = redirectUrl,
                Message         = inforceMsg
            };
        }


        public async Task<CancelPaymentResponse> CancelPaymentAsync(string referenceNumber)
        {
            var payment = await _paymentRepository.GetByReferenceNumberAsync(referenceNumber);
            if (payment == null)
                throw new KeyNotFoundException($"Payment with reference '{referenceNumber}' not found.");

            if (payment.Status != "PENDING")
            {
                return new CancelPaymentResponse
                {
                    ReferenceNumber = payment.ReferenceNumber,
                    PaymentStatus   = payment.Status,
                    Message         = $"Payment is already in '{payment.Status}' status — no change made."
                };
            }

            payment.Status = "CANCELLED";
            _paymentRepository.UpdatePayment(payment);
            await _paymentRepository.SaveChangesAsync();

            _logger.LogInformation(
                "Payment cancelled by customer | ReferenceNumber={ReferenceNumber} ProposalId={ProposalId}",
                payment.ReferenceNumber, payment.ProposalId);

            return new CancelPaymentResponse
            {
                ReferenceNumber = payment.ReferenceNumber,
                PaymentStatus   = "CANCELLED",
                Message         = "Payment cancelled. You can now retry payment for this proposal."
            };
        }

        private string BuildFrontendSuccessUrl(string referenceNumber, string policyNumber = "")
        {
            var baseUrl = _stripeSettings.FrontendSuccessUrl;
            var url     = $"{baseUrl}?ref={Uri.EscapeDataString(referenceNumber)}&status=paid";
            if (!string.IsNullOrEmpty(policyNumber))
                url += $"&policy={Uri.EscapeDataString(policyNumber)}";
            return url;
        }


        private static string GenerateReferenceNumber(string region)
        {
            var year     = DateTime.UtcNow.Year;
            var sequence = new Random().Next(100000, 999999);
            return $"PAY-{region.ToUpper()}-{year}-{sequence}";
        }

    }
}
