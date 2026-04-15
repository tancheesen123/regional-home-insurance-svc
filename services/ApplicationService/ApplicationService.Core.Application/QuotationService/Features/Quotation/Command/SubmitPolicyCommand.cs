using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.QuotationService.DTOs;
using ApplicationService.Core.Application.QuotationService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.QuotationService.Features.Quotation.Command
{
    public class SubmitPolicyCommand : IRequest<Response<SubmitPolicyResponse>>
    {
        public SubmitPolicyRequest Request { get; set; }

        public class SubmitPolicyCommandHandler : IRequestHandler<SubmitPolicyCommand, Response<SubmitPolicyResponse>>
        {
            private readonly ILogger<SubmitPolicyCommandHandler> _logger;
            private readonly IQuotationService _quotationService;

            public SubmitPolicyCommandHandler(
                ILogger<SubmitPolicyCommandHandler> logger,
                IQuotationService quotationService)
            {
                _logger = logger;
                _quotationService = quotationService;
            }

            public async Task<Response<SubmitPolicyResponse>> Handle(SubmitPolicyCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start SubmitPolicyCommandHandler ===");

                var result = await _quotationService.SubmitPolicyAsync(request.Request);

                return new Response<SubmitPolicyResponse>(result);
            }
        }
    }
}
