using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Infrastructure.Shared.Services
{
    public class ProposalErrorService : IProposalErrorService
    {
        private readonly ILogger<ProposalErrorService> _logger;

        public ProposalErrorService(ILogger<ProposalErrorService> logger)
        {
            _logger = logger;
        }

        public Task LogErrorAsync(string proposalId, string operation, Exception exception)
        {
            _logger.LogError(exception,
                "InforcePolicy error | ProposalId={ProposalId} Operation={Operation}",
                proposalId, operation);

            return Task.CompletedTask;
        }
    }
}
