using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Infrastructure.Shared.Services
{
    /// <summary>
    /// Stub implementation of IProposalErrorService.
    /// Replace with a DB-backed error log table when needed.
    /// </summary>
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

            // TODO: Persist to ProposalErrors table for ops review / retry.
            return Task.CompletedTask;
        }
    }
}
