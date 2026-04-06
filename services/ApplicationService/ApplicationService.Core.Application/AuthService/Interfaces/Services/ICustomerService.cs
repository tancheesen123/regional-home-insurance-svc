using ApplicationService.Core.Application.AuthService.DTOs.Customer;

namespace ApplicationService.Core.Application.AuthService.Interfaces.Services
{
    public interface ICustomerService
    {
        Task<CustomerGetAllResponse> GetAllCustomerAsync();
    }
}
