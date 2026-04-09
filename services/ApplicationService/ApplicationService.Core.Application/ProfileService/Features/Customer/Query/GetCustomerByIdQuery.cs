using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProfileService.Features.Customer.Query
{
    public class GetCustomerByIdQuery : IRequest<Response<GetCustomerByUserIdResponse>>
    {
        public string UserId { get; set; }

        public class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQuery, Response<GetCustomerByUserIdResponse>>
        {
            private readonly ILogger<GetCustomerByIdQueryHandler> _logger;
            private readonly ICustomerService _customerService;

            public GetCustomerByIdQueryHandler(
                ILogger<GetCustomerByIdQueryHandler> logger,
                ICustomerService customerService)
            {
                _logger = logger;
                _customerService = customerService;
            }

            public async Task<Response<GetCustomerByUserIdResponse>> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start GetCustomerByIdQueryHandler ===");

                var result = await _customerService.GetCustomerByUserIdAsync(request.UserId);

                return new Response<GetCustomerByUserIdResponse>(result);
            }
        }
    }
}
