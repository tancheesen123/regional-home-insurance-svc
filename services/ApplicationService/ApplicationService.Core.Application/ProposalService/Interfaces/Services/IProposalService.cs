using ApplicationService.Core.Application.ProposalService.DTOs;

namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
    public interface IProposalService
    {
        Task<CreateProposalResponse> CreateProposalAsync(CreateProposalRequest request);
        Task<GetProposalResponse> GetProposalAsync(GetProposalRequest request);
    }
}
