using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.QuotationService.DTOs;
using ApplicationService.Core.Application.QuotationService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.QuotationService.Features.Quotation.Command
{
    public class CustomizePlanCommand : IRequest<Response<CustomizePlanResponse>>
    {
        public CustomizePlanRequest Request { get; set; }

        public class CustomizePlanCommandHandler : IRequestHandler<CustomizePlanCommand, Response<CustomizePlanResponse>>
        {
            private readonly ILogger<CustomizePlanCommandHandler> _logger;
            private readonly IQuotationService _quotationService;

            public CustomizePlanCommandHandler(
                ILogger<CustomizePlanCommandHandler> logger,
                IQuotationService quotationService)
            {
                _logger = logger;
                _quotationService = quotationService;
            }

            public async Task<Response<CustomizePlanResponse>> Handle(CustomizePlanCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start CustomizePlanCommandHandler ===");

                var result = await _quotationService.CustomizePlanAsync(request.Request);

                return new Response<CustomizePlanResponse>(result);
            }
        }
    }
}
