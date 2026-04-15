using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProfileService.Features.Customer.Command
{
    public class UpdateCustomerCommand : IRequest<Response<UpdateCustomerResponse>>
    {
        public string UserId { get; set; }
        public UpdateCustomerRequest Request { get; set; }

        public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, Response<UpdateCustomerResponse>>
        {
            private readonly ILogger<UpdateCustomerCommandHandler> _logger;
            private readonly ICustomerService _customerService;

            public UpdateCustomerCommandHandler(
                ILogger<UpdateCustomerCommandHandler> logger,
                ICustomerService customerService)
            {
                _logger = logger;
                _customerService = customerService;
            }

            public async Task<Response<UpdateCustomerResponse>> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start UpdateCustomerCommandHandler ===");

                var result = await _customerService.UpdateCustomerAsync(request);

                return new Response<UpdateCustomerResponse>(result);
            }
        }
    }
}
