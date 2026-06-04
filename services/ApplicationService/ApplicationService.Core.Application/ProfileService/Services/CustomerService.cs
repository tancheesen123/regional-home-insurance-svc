using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Features.Customer.Command;
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

        public CustomerService(ILogger<CustomerService> logger, IMapper mapper, ICustomerRepository customerRepository)
        {
            _logger             = logger;
            _mapper             = mapper;
            _customerRepository = customerRepository;
        }

        public async Task<CustomerGetAllResponse> GetAllCustomerAsync()
        {
            _logger.LogInformation("=== CustomerService.GetAllCustomerAsync ===");
            var customers = await _customerRepository.GetAllAsync();
            return new CustomerGetAllResponse { Customers = _mapper.Map<List<CustomerDetail>>(customers) };
        }

        public async Task<GetCustomerByUserIdResponse> GetCustomerByUserIdAsync(string userId)
        {
            _logger.LogInformation("=== CustomerService.GetCustomerByUserIdAsync ===");
            var customer = await _customerRepository.GetByUserIdAsync(userId);
            if (customer == null) throw new KeyNotFoundException($"No customer found for UserId ''{userId}''.");

            return new GetCustomerByUserIdResponse
            {
                CustomerId  = customer.CustomerId,
                FirstName   = customer.FirstName,
                LastName    = customer.LastName,
                DateOfBirth = customer.DateOfBirth,
                Gender      = customer.Gender,
                Nationality = customer.Nationality,
                IdType      = customer.IdType,
                IdNumber    = customer.IdNumber,
                Contact     = customer.Contact,
                Email       = customer.Email,
                Region      = customer.Region,
                UserId      = customer.UserId,
                Address = (customer.AddressLine1 != null || customer.City != null) ? new AddressDto
                {
                    AddressLine1 = customer.AddressLine1,
                    AddressLine2 = customer.AddressLine2,
                    City         = customer.City,
                    Postcode     = customer.Postcode,
                    State        = customer.State,
                    Country      = customer.Country
                } : null
            };
        }

        public async Task<UpdateCustomerResponse> UpdateCustomerAsync(UpdateCustomerCommand request)
        {
            _logger.LogInformation("=== CustomerService.UpdateCustomerAsync ===");
            var customer = await _customerRepository.GetByUserIdAsync(request.UserId);
            if (customer == null) throw new KeyNotFoundException($"No customer found for UserId ''{request.UserId}''.");

            customer.FirstName   = request.Request.FirstName;
            customer.LastName    = request.Request.LastName;
            customer.DateOfBirth = request.Request.DateOfBirth;
            customer.Gender      = request.Request.Gender;
            customer.Nationality = request.Request.Nationality;
            customer.IdType      = request.Request.IdType;
            customer.IdNumber    = request.Request.IdNumber;
            customer.Contact     = request.Request.Contact;
            customer.UpdatedAt   = DateTime.UtcNow;

            if (request.Request.Address != null)
            {
                customer.AddressLine1 = request.Request.Address.AddressLine1;
                customer.AddressLine2 = request.Request.Address.AddressLine2;
                customer.City         = request.Request.Address.City;
                customer.Postcode     = request.Request.Address.Postcode;
                customer.State        = request.Request.Address.State;
                customer.Country      = request.Request.Address.Country;
            }

            _customerRepository.Update(customer);
            await _customerRepository.SaveChangesAsync();

            return new UpdateCustomerResponse
            {
                CustomerId  = customer.CustomerId,
                FirstName   = customer.FirstName,
                LastName    = customer.LastName,
                DateOfBirth = customer.DateOfBirth,
                Gender      = customer.Gender,
                Nationality = customer.Nationality,
                IdType      = customer.IdType,
                IdNumber    = customer.IdNumber,
                Contact     = customer.Contact,
                Address = (customer.AddressLine1 != null || customer.City != null) ? new AddressDto
                {
                    AddressLine1 = customer.AddressLine1,
                    AddressLine2 = customer.AddressLine2,
                    City         = customer.City,
                    Postcode     = customer.Postcode,
                    State        = customer.State,
                    Country      = customer.Country
                } : null,
                Message = "Customer data updated successfully."
            };
        }
    }
}
