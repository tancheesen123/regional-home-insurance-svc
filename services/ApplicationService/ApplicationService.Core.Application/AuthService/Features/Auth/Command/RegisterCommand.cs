using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.AuthService.Features.Auth.Command
{
    public class RegisterCommand : IRequest<Response<RegisterResponse>>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Nationality { get; set; }
        public string? IdType { get; set; }
        public string IdNumber { get; set; }
        public string Contact { get; set; }
        public string Region { get; set; }
        public AddressDto? Address { get; set; }

        public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Response<RegisterResponse>>
        {
            private readonly ILogger<RegisterCommandHandler> _logger;
            private readonly IAuthService _authService;

            public RegisterCommandHandler(
                ILogger<RegisterCommandHandler> logger,
                IAuthService authService)
            {
                _logger = logger;
                _authService = authService;
            }

            public async Task<Response<RegisterResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start RegisterCommandHandler ===");

                var result = await _authService.RegisterAsync(request);

                return new Response<RegisterResponse>(result);
            }
        }
    }
}
