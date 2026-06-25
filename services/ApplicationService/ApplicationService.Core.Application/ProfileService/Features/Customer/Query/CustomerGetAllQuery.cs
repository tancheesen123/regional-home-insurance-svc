using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProfileService.Features.Customer.Query
{
    public class CustomerGetAllQuery: IRequest<Response<CustomerGetAllResponse>>
    {
        public class CustomerGetAllQueryHandler : IRequestHandler<CustomerGetAllQuery, Response<CustomerGetAllResponse>>
        {
            private readonly ILogger<CustomerGetAllQueryHandler> _logger;
            private readonly IMapper _mapper;
            private readonly ICustomerService _customerService;

            public CustomerGetAllQueryHandler(ILogger<CustomerGetAllQueryHandler> logger,
                IMapper mapper,
                ICustomerService customerService)
            {
                _logger = logger;
                _mapper = mapper;
                _customerService = customerService;
            }

            public async Task<Response<CustomerGetAllResponse>> Handle(CustomerGetAllQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start CustomerGetAllQueryHandler ===");
                CustomerGetAllResponse retieveResult = await _customerService.GetAllCustomerAsync();
                return new Response<CustomerGetAllResponse>(retieveResult);
            }
        }
    }
}
