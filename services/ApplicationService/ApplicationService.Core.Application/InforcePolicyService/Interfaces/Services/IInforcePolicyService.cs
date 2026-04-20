using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using System.Security.Claims;

namespace ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services
{
    public interface IInforcePolicyService
    {
        Task<InforcePolicyResponse> InforcePolicyAsync(InforcePolicyRequest request, ClaimsPrincipal user);
    }
}
