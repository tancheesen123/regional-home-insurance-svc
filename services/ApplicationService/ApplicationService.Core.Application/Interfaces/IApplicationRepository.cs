using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.Interfaces
{
    public interface IApplicationRepository
    {
        Task<List<ApplicationEntity>> GetAllAsync();
        Task<ApplicationEntity?> GetByIdAsync(Guid id);
        Task AddAsync(ApplicationEntity application);
        Task SaveChangesAsync();
    }
}