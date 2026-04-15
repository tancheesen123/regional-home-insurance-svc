using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.QuotationService.DTOs;
using ApplicationService.Core.Application.QuotationService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.QuotationService.Features.Quotation.Command
{
    public class GetQuoteCommand : IRequest<Response<GetQuoteResponse>>
    {
        public GetQuoteRequest Request { get; set; }
        public string Region { get; set; }

        public class GetQuoteCommandHandler : IRequestHandler<GetQuoteCommand, Response<GetQuoteResponse>>
        {
            private readonly ILogger<GetQuoteCommandHandler> _logger;
            private readonly IQuotationService _quotationService;

            public GetQuoteCommandHandler(
                ILogger<GetQuoteCommandHandler> logger,
                IQuotationService quotationService)
            {
                _logger = logger;
                _quotationService = quotationService;
            }

            public async Task<Response<GetQuoteResponse>> Handle(GetQuoteCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start GetQuoteCommandHandler ===");

                var result = await _quotationService.GetQuoteAsync(request.Request, request.Region);

                return new Response<GetQuoteResponse>(result);
            }
        }
    }
}
