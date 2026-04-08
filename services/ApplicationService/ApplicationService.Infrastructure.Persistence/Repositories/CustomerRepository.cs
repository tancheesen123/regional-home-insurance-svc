using ApplicationService.Core.Application.ProfileService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(DbContextResolver resolver) : base(resolver) { }
    }
}
