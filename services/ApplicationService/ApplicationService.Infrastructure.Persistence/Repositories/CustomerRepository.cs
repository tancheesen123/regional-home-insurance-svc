using ApplicationService.Core.Application.ProfileService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        private readonly DbContextResolver _resolver;

        public CustomerRepository(DbContextResolver resolver) : base(resolver)
        {
            _resolver = resolver;
        }

        public async Task<Customer?> GetByUserIdAsync(string userId)
        {
            return await _resolver.Resolve().Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }
    }
}
