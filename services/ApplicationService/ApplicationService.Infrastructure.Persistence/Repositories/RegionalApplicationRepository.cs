using Microsoft.EntityFrameworkCore;
using ApplicationService.Core.Domain.Entities;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class RegionalApplicationRepository : IApplicationRepository
    {
        private readonly DbContextResolver _resolver;

        public RegionalApplicationRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }




        public async Task SaveChangesAsync()
        {
            await _resolver.Resolve().SaveChangesAsync();
        }
    }
}
