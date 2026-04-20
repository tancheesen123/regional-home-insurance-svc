using ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Infrastructure.Shared.Services
{
    /// <summary>
    /// Stub implementation of IInforceService.
    /// Replace with actual PDF generation / notification dispatching logic.
    /// </summary>
    public class InforceService : IInforceService
    {
        private readonly ILogger<InforceService> _logger;

        public InforceService(ILogger<InforceService> logger)
        {
            _logger = logger;
        }

        public Task BackendInvokeAsync(BackendInvokeRequest request)
        {
            _logger.LogInformation(
                "BackendInvokeAsync | ProposalId={ProposalId} PolicyNumber={PolicyNumber} Region={Region} " +
                "SendEmail={SendEmail} SendSms={SendSms}",
                request.ProposalId, request.PolicyNumber, request.Region,
                request.SendEmail, request.SendSms);

            // TODO: Trigger PDF generation, email/SMS dispatch, downstream system calls.
            return Task.CompletedTask;
        }
    }
}
