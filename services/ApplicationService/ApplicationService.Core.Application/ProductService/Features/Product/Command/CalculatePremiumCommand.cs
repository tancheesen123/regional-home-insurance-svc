using ApplicationService.Core.Application.ProductService.DTOs;
using ApplicationService.Core.Application.ProductService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProductService.Features.Product.Command
{
    public class CalculatePremiumCommand : IRequest<CalculatePremiumResponse>
    {
        public CalculatePremiumRequest Request { get; set; } = null!;

        public string Region { get; set; } = string.Empty;

        public class CalculatePremiumCommandHandler
            : IRequestHandler<CalculatePremiumCommand, CalculatePremiumResponse>
        {
            private readonly ILogger<CalculatePremiumCommandHandler> _logger;
            private readonly IProductService _productService;

            public CalculatePremiumCommandHandler(
                ILogger<CalculatePremiumCommandHandler> logger,
                IProductService productService)
            {
                _logger         = logger;
                _productService = productService;
            }

            public async Task<CalculatePremiumResponse> Handle(
                CalculatePremiumCommand command, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start CalculatePremiumCommandHandler | Region={Region} ===",
                    command.Region);

                return await _productService.CalculatePremiumAsync(command.Request, command.Region);
            }
        }
    }
}
