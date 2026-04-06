using ApplicationService.Core.Application.AuthService.Features.Customer.Query;
using ApplicationService.Core.Application.AuthService.Features.Auth.Query;
using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using ApplicationService.Core.Application.AuthService.Mappings;
using ApplicationService.Core.Application.AuthService.Services;

namespace ApplicationService.WebAPI.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg => cfg.AddProfile<CustomerMappingProfile>());

            //declare query
            services.AddMediatR(cfg =>cfg.RegisterServicesFromAssembly(typeof(CustomerGetAllQuery).Assembly));
            services.AddMediatR(cfg =>cfg.RegisterServicesFromAssembly(typeof(AuthGetAllQuery).Assembly));

            //declare service
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IAuthService, AuthService>();

            return services;
        }
    }
}
