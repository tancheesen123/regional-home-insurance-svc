using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.QuotationService.DTOs;
using ApplicationService.Core.Application.QuotationService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.QuotationService.Features.Quotation.Command
{
    public class DeclareValuablesCommand : IRequest<Response<DeclareValuablesResponse>>
    {
        public DeclareValuablesRequest Request { get; set; }

        public class DeclareValuablesCommandHandler : IRequestHandler<DeclareValuablesCommand, Response<DeclareValuablesResponse>>
        {
            private readonly ILogger<DeclareValuablesCommandHandler> _logger;
            private readonly IQuotationService _quotationService;

            public DeclareValuablesCommandHandler(
                ILogger<DeclareValuablesCommandHandler> logger,
                IQuotationService quotationService)
            {
                _logger = logger;
                _quotationService = quotationService;
            }

            public async Task<Response<DeclareValuablesResponse>> Handle(DeclareValuablesCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start DeclareValuablesCommandHandler ===");

                var result = await _quotationService.DeclareValuablesAsync(request.Request);

                return new Response<DeclareValuablesResponse>(result);
            }
        }
    }
}
