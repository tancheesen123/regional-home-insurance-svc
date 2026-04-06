using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.DTOs.Customer;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Core.Application.AuthService.Services
{
    public class AuthService : IAuthService
    {
        private readonly ILogger<AuthService> _logger;
        private readonly IMapper _mapper;
        private readonly IAuthRepository _authRepository;

        public AuthService(
            ILogger<AuthService> logger,
            IMapper mapper,
            IAuthRepository authRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _authRepository = authRepository;
        }

        public async Task<AuthGetAllResponse> GetAllCustomerAsync()
        {
            _logger.LogInformation("=== CustomerService.GetAllCustomerAsync ===");

            var auth = await _authRepository.GetAllAuthAsync();

            return new AuthGetAllResponse
            {
                Auths = _mapper.Map<List<AuthDetail>>(auth)
            };
        }
    }
}
