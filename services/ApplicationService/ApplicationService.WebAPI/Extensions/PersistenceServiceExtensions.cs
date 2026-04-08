using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Application.Common.Interfaces;
using ApplicationService.Core.Application.ProfileService.Interfaces.Repositories;
using ApplicationService.Infrastructure.Persistence;
using ApplicationService.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.WebAPI.Extensions
{
    public static class PersistenceServiceExtensions
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<PHApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("PHUnityDb")));

            services.AddDbContext<IDApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("IDUnityDb")));

            services.AddDbContext<KHApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("KHUnityDb")));

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddHttpContextAccessor();
            services.AddScoped<DbContextResolver>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IApplicationRepository, RegionalApplicationRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();

            return services;
        }
    }
}
