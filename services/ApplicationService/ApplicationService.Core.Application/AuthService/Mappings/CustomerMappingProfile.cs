using ApplicationService.Core.Application.AuthService.DTOs.Customer;
using ApplicationService.Core.Application.AuthService.DTOs.Auth;
using ApplicationService.Core.Domain.Entities;
using AutoMapper;

namespace ApplicationService.Core.Application.AuthService.Mappings
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
