using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.PaymentService.DTOs;
using ApplicationService.Core.Application.PaymentService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.PaymentService.Features.Payment.Command
{
    public class InitiatePaymentCommand : IRequest<Response<InitiatePaymentResponse>>
    {
        public InitiatePaymentRequest Request { get; set; }
        public string Region { get; set; } = string.Empty;

        public class InitiatePaymentCommandHandler : IRequestHandler<InitiatePaymentCommand, Response<InitiatePaymentResponse>>
        {
            private readonly ILogger<InitiatePaymentCommandHandler> _logger;
            private readonly IPaymentService _paymentService;

            public InitiatePaymentCommandHandler(
                ILogger<InitiatePaymentCommandHandler> logger,
                IPaymentService paymentService)
            {
                _logger = logger;
                _paymentService = paymentService;
            }

            public async Task<Response<InitiatePaymentResponse>> Handle(InitiatePaymentCommand command, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start InitiatePaymentCommandHandler | Region={Region} ===",
                    command.Region);

                var result = await _paymentService.InitiatePaymentAsync(command.Request, command.Region);

                return new Response<InitiatePaymentResponse>(result);
            }
        }
    }
}
