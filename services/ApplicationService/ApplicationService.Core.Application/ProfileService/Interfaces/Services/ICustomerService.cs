using ApplicationService.Core.Application.ProfileService.DTOs.Customer;
using ApplicationService.Core.Application.ProfileService.Features.Customer.Command;

namespace ApplicationService.Core.Application.ProfileService.Interfaces.Services
{
    public interface ICustomerService
    {
        Task<CustomerGetAllResponse> GetAllCustomerAsync();
        Task<UpdateCustomerResponse> UpdateCustomerAsync(UpdateCustomerCommand request);
        Task<UploadProfilePictureResponse> UploadProfilePictureAsync(UploadProfilePictureCommand request);
    }
}
