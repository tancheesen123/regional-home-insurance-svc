using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.AuthService.Interfaces.Repositories
{
    public interface IApplicationRepository
    {
        Task SaveChangesAsync();
    }
}