using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.PaymentService.DTOs;
using ApplicationService.Core.Application.PaymentService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.PaymentService.Features.Payment.Command
{
    public class PaymentCallbackCommand : IRequest<Response<PaymentCallbackResponse>>
    {
        public string Json { get; set; }

        public string StripeSignature { get; set; }

        public class PaymentCallbackCommandHandler
            : IRequestHandler<PaymentCallbackCommand, Response<PaymentCallbackResponse>>
        {
            private readonly ILogger<PaymentCallbackCommandHandler> _logger;
            private readonly IPaymentService _paymentService;

            public PaymentCallbackCommandHandler(
                ILogger<PaymentCallbackCommandHandler> logger,
                IPaymentService paymentService)
            {
                _logger = logger;
                _paymentService = paymentService;
            }

            public async Task<Response<PaymentCallbackResponse>> Handle(
                PaymentCallbackCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start PaymentCallbackCommandHandler ===");

                var result = await _paymentService.HandleCallbackAsync(
                    request.Json, request.StripeSignature);

                return new Response<PaymentCallbackResponse>(result);
            }
        }
    }
}
