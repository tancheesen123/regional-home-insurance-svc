using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace ApplicationService.Core.Application.InforcePolicyService.Features.InforcePolicy.Command
{
    public class InforcePolicyCommand : IRequest<Response<InforcePolicyResponse>>
    {
        public InforcePolicyRequest Request { get; set; } = new();
        public ClaimsPrincipal       User    { get; set; } = new();

        public class InforcePolicyCommandHandler
            : IRequestHandler<InforcePolicyCommand, Response<InforcePolicyResponse>>
        {
            private readonly ILogger<InforcePolicyCommandHandler> _logger;
            private readonly IInforcePolicyService                _service;

            public InforcePolicyCommandHandler(
                ILogger<InforcePolicyCommandHandler> logger,
                IInforcePolicyService service)
            {
                _logger  = logger;
                _service = service;
            }

            public async Task<Response<InforcePolicyResponse>> Handle(
                InforcePolicyCommand command, CancellationToken cancellationToken)
            {
                _logger.LogInformation(
                    "=== InforcePolicyCommandHandler | ProposalId={ProposalId} ===",
                    command.Request.ProposalId);

                var result = await _service.InforcePolicyAsync(command.Request, command.User);
                return new Response<InforcePolicyResponse>(result);
            }
        }
    }
}
