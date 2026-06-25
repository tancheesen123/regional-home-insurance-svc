using ApplicationService.Core.Application.InforcePolicyService.DTOs;

namespace ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services
{
    public interface IInforceService
    {
        Task BackendInvokeAsync(BackendInvokeRequest request);
    }
}
