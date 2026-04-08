using ApplicationService.Core.Application.ProfileService.DTOs.Customer;

namespace ApplicationService.Core.Application.ProfileService.Interfaces.Services
{
    public interface ICustomerService
    {
        Task<CustomerGetAllResponse> GetAllCustomerAsync();
    }
}
