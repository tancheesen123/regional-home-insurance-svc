using ApplicationService.Core.Application.AuthService.DTOs.Customer;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.AuthService.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ILogger<CustomerService> _logger;
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(
            ILogger<CustomerService> logger,
            ICustomerRepository customerRepository)
        {
            _logger = logger;
            _customerRepository = customerRepository;
        }

        public async Task<CustomerGetAllResponse> GetAllCustomerAsync()
        {
            _logger.LogInformation("=== CustomerService.GetAllCustomerAsync ===");

            var customers = await _customerRepository.GetAllAsync();

            return new CustomerGetAllResponse
            {
                Customers = customers.Select(c => new CustomerDetail
                {
                    CustomerId = c.CustomerId,
                    Name      = c.Name,
                    IcNumber  = c.IcNumber,
                    Address   = c.Address,
                    Contact   = c.Contact,
                    Email     = c.Email,
                    Region    = c.Region,
                    UserId    = c.UserId
                }).ToList()
            };
        }
    }
}
