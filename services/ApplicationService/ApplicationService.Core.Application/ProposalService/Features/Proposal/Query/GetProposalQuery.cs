using ApplicationService.Core.Application.AuthService.DTOs;
using ApplicationService.Core.Application.ProposalService.DTOs;
using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Core.Application.ProposalService.Features.Proposal.Query
{
    public class GetProposalQuery : IRequest<Response<GetProposalResponse>>
    {
        public GetProposalRequest Request { get; set; }

        public class GetProposalQueryHandler : IRequestHandler<GetProposalQuery, Response<GetProposalResponse>>
        {
            private readonly ILogger<GetProposalQueryHandler> _logger;
            private readonly IProposalService _proposalService;

            public GetProposalQueryHandler(
                ILogger<GetProposalQueryHandler> logger,
                IProposalService proposalService)
            {
                _logger = logger;
                _proposalService = proposalService;
            }

            public async Task<Response<GetProposalResponse>> Handle(GetProposalQuery request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("=== Start GetProposalQueryHandler ===");

                var result = await _proposalService.GetProposalAsync(request.Request);

                return new Response<GetProposalResponse>(result);
            }
        }
    }
}
