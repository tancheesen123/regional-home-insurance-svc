using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using AutoMapper;
using Microsoft.Extensions.Logging;
using ApplicationService.Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Core.Application.AuthService.Services
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

        public async Task<Customer> GetAllCustomerAsync()
        {
            var eventEntity = await _customerRepository.GetAllAsync();
            //if (eventEntity == null)
            //{
            //    throw new NotFoundException("APP001 : No proposal found with the passed ID " + id, ErrorCodeHandler.GetErrorCode("0339"));
            //}
            return eventEntity;
        }
    }


}
