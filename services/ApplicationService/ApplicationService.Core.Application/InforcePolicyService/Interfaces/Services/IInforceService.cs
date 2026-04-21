using ApplicationService.Core.Application.InforcePolicyService.DTOs;

namespace ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services
{
    /// <summary>
    /// Triggers asynchronous backend processing after a policy is inforced:
    /// PDF generation, email/SMS dispatch, downstream system notifications.
    /// </summary>
    public interface IInforceService
    {
        Task BackendInvokeAsync(BackendInvokeRequest request);
    }
}
