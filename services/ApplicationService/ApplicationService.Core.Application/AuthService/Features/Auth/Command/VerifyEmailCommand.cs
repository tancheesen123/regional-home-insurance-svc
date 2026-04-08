using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.AuthService.Features.Auth.Command
{
    public class VerifyEmailCommand : IRequest<Response<bool>>
    {
        public string Token { get; set; }
        public string Email { get; set; }

        public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, Response<bool>>
        {
            private readonly ILogger<VerifyEmailCommandHandler> _logger;
            private readonly IAuthService _authService;

            public VerifyEmailCommandHandler(
                ILogger<VerifyEmailCommandHandler> logger,
                IAuthService authService)
            {
                _logger = logger;
                _authService = authService;
            }

            public async Task<Response<bool>> Handle(VerifyEmailCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start VerifyEmailCommandHandler ===");

                var result = await _authService.VerifyEmailAsync(request.Token, request.Email);

                return new Response<bool>(result);
            }
        }
    }
}
