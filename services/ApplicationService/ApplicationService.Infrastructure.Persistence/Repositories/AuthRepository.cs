using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DbContextResolver _resolver;

        public AuthRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        public async Task<List<UserAccount>> GetAllAuthAsync()
        {
            return await _resolver.Resolve().UserAccounts.ToListAsync();
        }
    }
}
