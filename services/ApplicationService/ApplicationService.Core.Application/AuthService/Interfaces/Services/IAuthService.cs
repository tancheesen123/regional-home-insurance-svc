using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.Features.Auth.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Core.Application.AuthService.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthGetAllResponse> GetAllCustomerAsync();
        Task<LoginResponse> LoginAsync(string email, string password);
        Task<RegisterResponse> RegisterAsync(RegisterCommand request);
        Task<bool> VerifyEmailAsync(string token, string email);
    }
}
