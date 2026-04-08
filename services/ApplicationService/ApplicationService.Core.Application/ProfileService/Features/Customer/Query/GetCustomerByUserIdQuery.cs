using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProfileService.Features.Customer.Query
{
    public class GetCustomerByUserIdQuery : IRequest<Response<GetCustomerByUserIdResponse>>
    {
        public string UserId { get; set; }

        public class GetCustomerByUserIdQueryHandler : IRequestHandler<GetCustomerByUserIdQuery, Response<GetCustomerByUserIdResponse>>
        {
            private readonly ILogger<GetCustomerByUserIdQueryHandler> _logger;
            private readonly ICustomerService _customerService;

            public GetCustomerByUserIdQueryHandler(
                ILogger<GetCustomerByUserIdQueryHandler> logger,
                ICustomerService customerService)
            {
                _logger = logger;
                _customerService = customerService;
            }

            public async Task<Response<GetCustomerByUserIdResponse>> Handle(GetCustomerByUserIdQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start GetCustomerByUserIdQueryHandler ===");

                var result = await _customerService.GetCustomerByUserIdAsync(request.UserId);

                return new Response<GetCustomerByUserIdResponse>(result);
            }
        }
    }
}
