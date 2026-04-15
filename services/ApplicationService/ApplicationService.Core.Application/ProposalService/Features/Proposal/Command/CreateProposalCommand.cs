using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.ProposalService.DTOs;
using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProposalService.Features.Proposal.Command
{
    public class CreateProposalCommand : IRequest<Response<CreateProposalResponse>>
    {
        public CreateProposalRequest Request { get; set; }

        public class CreateProposalCommandHandler : IRequestHandler<CreateProposalCommand, Response<CreateProposalResponse>>
        {
            private readonly ILogger<CreateProposalCommandHandler> _logger;
            private readonly IProposalService _proposalService;

            public CreateProposalCommandHandler(
                ILogger<CreateProposalCommandHandler> logger,
                IProposalService proposalService)
            {
                _logger = logger;
                _proposalService = proposalService;
            }

            public async Task<Response<CreateProposalResponse>> Handle(CreateProposalCommand request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start CreateProposalCommandHandler ===");

                var result = await _proposalService.CreateProposalAsync(request.Request);

                return new Response<CreateProposalResponse>(result);
            }
        }
    }
}
