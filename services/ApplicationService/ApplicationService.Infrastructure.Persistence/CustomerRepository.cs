using Microsoft.EntityFrameworkCore;
using ApplicationService.Core.Application.Interfaces;
using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Infrastructure.Persistence
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
