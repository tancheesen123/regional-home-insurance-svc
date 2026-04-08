using ApplicationService.Core.Application.Common.Interfaces;
using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.AuthService.Interfaces.Repositories
{
    public interface IAuthRepository : IGenericRepository<UserAccount>
    {
        Task<UserAccount?> GetByEmailAsync(string email);
        Task RegisterAsync(UserAccount userAccount, Customer customer);
        Task UpdateIsVerifiedAsync(string userId);
    }
}
