using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using ApplicationService.Core.Application.ProposalService.DTOs;
using System.Security.Claims;

namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
    public interface IProposalService
    {
        Task<CreateProposalResponse> CreateProposalAsync(CreateProposalRequest request, ClaimsPrincipal user);
        Task<GetProposalResponse> GetProposalAsync(GetProposalRequest request, ClaimsPrincipal user);

        void ExecuteCallInBackend(BackendInvokeRequest request);
    }
}
