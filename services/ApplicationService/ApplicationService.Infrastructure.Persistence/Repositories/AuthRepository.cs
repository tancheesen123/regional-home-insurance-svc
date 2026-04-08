using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class AuthRepository : GenericRepository<UserAccount>, IAuthRepository
    {
        private readonly DbContextResolver _resolver;

        public AuthRepository(DbContextResolver resolver) : base(resolver)
        {
            _resolver = resolver;
        }

        public async Task<UserAccount?> GetByEmailAsync(string email)
        {
            return await _resolver.Resolve().UserAccounts
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task RegisterAsync(UserAccount userAccount, Customer customer)
        {
            var context = _resolver.Resolve();
            await context.UserAccounts.AddAsync(userAccount);
            await context.Customers.AddAsync(customer);
            await context.SaveChangesAsync();
        }

        public async Task UpdateIsVerifiedAsync(string userId)
        {
            var context = _resolver.Resolve();
            var user = await context.UserAccounts.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user != null)
            {
                user.IsVerified = true;
                await context.SaveChangesAsync();
            }
        }
    }
}
