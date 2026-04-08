using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Interfaces.Repositories;
using ApplicationService.Core.Application.ProfileService.Interfaces.Services;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProfileService.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ILogger<CustomerService> _logger;
        private readonly IMapper _mapper;
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(
            ILogger<CustomerService> logger,
            IMapper mapper,
            ICustomerRepository customerRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _customerRepository = customerRepository;
        }

        public async Task<CustomerGetAllResponse> GetAllCustomerAsync()
        {
            _logger.LogInformation("=== CustomerService.GetAllCustomerAsync ===");

            var customers = await _customerRepository.GetAllAsync();

            return new CustomerGetAllResponse
            {
                Customers = _mapper.Map<List<CustomerDetail>>(customers)
            };
        }
    }
}
