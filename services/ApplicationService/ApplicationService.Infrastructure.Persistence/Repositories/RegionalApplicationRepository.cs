using Microsoft.EntityFrameworkCore;
using ApplicationService.Core.Application.Interfaces;
using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class RegionalApplicationRepository : IApplicationRepository
    {
        private readonly DbContextResolver _resolver;

        public RegionalApplicationRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        //public async Task<List<Customer>> GetAllAsync()
        //{
        //    return await _resolver.Resolve().Customers.ToListAsync();
        //}

        //public async Task<ApplicationEntity?> GetByIdAsync(Guid id)
        //{
        //    return await _resolver.Resolve().Applications.FindAsync(id);
        //}

        //public async Task AddAsync(ApplicationEntity application)
        //{
        //    application.Id = Guid.NewGuid();
        //    application.CreatedAt = DateTime.UtcNow;
        //    await _resolver.Resolve().Applications.AddAsync(application);
        //}

        public async Task SaveChangesAsync()
        {
            await _resolver.Resolve().SaveChangesAsync();
        }
    }
}
