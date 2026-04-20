namespace ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services
{
    /// <summary>
    /// Persists inforce errors so they can be reviewed and retried by operations.
    /// </summary>
    public interface IProposalErrorService
    {
        Task LogErrorAsync(string proposalId, string operation, Exception exception);
    }
}
