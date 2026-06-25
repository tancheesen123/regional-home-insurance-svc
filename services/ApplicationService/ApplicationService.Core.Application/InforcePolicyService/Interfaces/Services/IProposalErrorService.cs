namespace ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services
{
    public interface IProposalErrorService
    {
        Task LogErrorAsync(string proposalId, string operation, Exception exception);
    }
}
