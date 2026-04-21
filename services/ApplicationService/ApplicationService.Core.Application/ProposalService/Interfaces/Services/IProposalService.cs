using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using ApplicationService.Core.Application.ProposalService.DTOs;

namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
    public interface IProposalService
    {
        Task<CreateProposalResponse> CreateProposalAsync(CreateProposalRequest request);
        Task<GetProposalResponse>   GetProposalAsync(GetProposalRequest request);

        /// <summary>
        /// Entry point called by InforceService after a policy is inforced.
        /// Creates a new DI scope internally then fires a background task:
        ///   GeneratePdfEmailSms → ExecutePdf → SendEmail → SendSms
        /// Mirrors commercial service ExecuteCallInBackend pattern.
        /// </summary>
        void ExecuteCallInBackend(BackendInvokeRequest request);
    }
}
