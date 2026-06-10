using ApplicationService.Core.Application.PaymentService.DTOs;
using ApplicationService.Core.Application.PaymentService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.PaymentService.Features.Payment.Command
{
    public class CancelPaymentCommand : IRequest<CancelPaymentResponse>
    {
        /// <summary>The payment reference number from the cancel redirect query string.</summary>
        public string ReferenceNumber { get; set; } = string.Empty;

        public class CancelPaymentCommandHandler
            : IRequestHandler<CancelPaymentCommand, CancelPaymentResponse>
        {
            private readonly ILogger<CancelPaymentCommandHandler> _logger;
            private readonly IPaymentService _paymentService;

            public CancelPaymentCommandHandler(
                ILogger<CancelPaymentCommandHandler> logger,
                IPaymentService paymentService)
            {
                _logger = logger;
                _paymentService = paymentService;
            }

            public async Task<CancelPaymentResponse> Handle(
                CancelPaymentCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start CancelPaymentCommandHandler | ReferenceNumber={ReferenceNumber} ===",
                    request.ReferenceNumber);

                return await _paymentService.CancelPaymentAsync(request.ReferenceNumber);
            }
        }
    }
}
