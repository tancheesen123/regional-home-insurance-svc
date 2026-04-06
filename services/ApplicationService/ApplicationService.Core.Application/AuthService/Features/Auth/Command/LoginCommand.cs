using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.AuthService.Features.Auth.Command
{
    public class LoginCommand : IRequest<Response<LoginResponse>>
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public class LoginCommandHandler : IRequestHandler<LoginCommand, Response<LoginResponse>>
        {
            private readonly ILogger<LoginCommandHandler> _logger;
            private readonly IAuthService _authService;

            public LoginCommandHandler(
                ILogger<LoginCommandHandler> logger,
                IAuthService authService)
            {
                _logger = logger;
                _authService = authService;
            }

            public async Task<Response<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start LoginCommandHandler ===");

                var result = await _authService.LoginAsync(request.Email, request.Password);

                return new Response<LoginResponse>(result);
            }
        }
    }
}
