using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.PaymentService.DTOs;
using ApplicationService.Core.Application.PaymentService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.PaymentService.Features.Payment.Command
{
    public class ConfirmPaymentCommand : IRequest<ConfirmPaymentResponse>
    {
        /// <summary>The Stripe Checkout Session ID from the redirect query string.</summary>
        public string SessionId { get; set; } = string.Empty;

        public class ConfirmPaymentCommandHandler
            : IRequestHandler<ConfirmPaymentCommand, ConfirmPaymentResponse>
        {
            private readonly ILogger<ConfirmPaymentCommandHandler> _logger;
            private readonly IPaymentService _paymentService;

            public ConfirmPaymentCommandHandler(
                ILogger<ConfirmPaymentCommandHandler> logger,
                IPaymentService paymentService)
            {
                _logger = logger;
                _paymentService = paymentService;
            }

            public async Task<ConfirmPaymentResponse> Handle(
                ConfirmPaymentCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start ConfirmPaymentCommandHandler | SessionId={SessionId} ===",
                    request.SessionId);

                return await _paymentService.ConfirmPaymentAsync(request.SessionId);
            }
        }
    }
}
