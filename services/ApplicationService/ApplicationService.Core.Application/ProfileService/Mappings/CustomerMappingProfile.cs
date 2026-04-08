using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Domain.Entities;
using AutoMapper;
using ApplicationService.Core.Application.ProfileService.DTOs.Customer;

namespace ApplicationService.Core.Application.ProfileService.Mappings
{
    public class CustomerMappingProfile : Profile
    {
        public CustomerMappingProfile()
        {
            CreateMap<Customer, CustomerDetail>();
            CreateMap<UserAccount, AuthDetail>();
        }
    }
}
