using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Infrastructure.Shared.Services
{
    public class InforceService : IInforceService
    {
        private readonly ILogger<InforceService> _logger;
        private readonly IProposalService        _proposalService;

        public InforceService(
            ILogger<InforceService> logger,
            IProposalService        proposalService)
        {
            _logger          = logger;
            _proposalService = proposalService;
        }

        public Task BackendInvokeAsync(BackendInvokeRequest request)
        {
            _logger.LogInformation(
                "InforceService.BackendInvokeAsync | ProposalId={ProposalId} PolicyNumber={PolicyNumber} " +
                "Region={Region} SendEmail={SendEmail} SendSms={SendSms}",
                request.ProposalId, request.PolicyNumber, request.Region,
                request.SendEmail, request.SendSms);

            _proposalService.ExecuteCallInBackend(request);

            return Task.CompletedTask;
        }
    }
}
