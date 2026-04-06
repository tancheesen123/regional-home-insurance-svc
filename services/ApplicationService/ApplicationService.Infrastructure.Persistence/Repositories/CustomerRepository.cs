using Microsoft.EntityFrameworkCore;
using ApplicationService.Core.Domain.Entities;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly DbContextResolver _resolver;

        public CustomerRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        public async Task<List<Customer>> GetAllAsync()
        {
            return await _resolver.Resolve().Customers.ToListAsync();
        }
    }
}
