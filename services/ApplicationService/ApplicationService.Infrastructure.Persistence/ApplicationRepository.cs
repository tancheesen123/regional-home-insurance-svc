using Microsoft.EntityFrameworkCore;
using ApplicationService.Core.Application.Interfaces;
using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Infrastructure.Persistence
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public ApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ApplicationEntity>> GetAllAsync()
        {
            return await _context.Applications.ToListAsync();
        }

        public async Task<ApplicationEntity?> GetByIdAsync(Guid id)
        {
            return await _context.Applications.FindAsync(id);
        }

        public async Task AddAsync(ApplicationEntity application)
        {
            application.Id = Guid.NewGuid();
            application.CreatedAt = DateTime.UtcNow;
            await _context.Applications.AddAsync(application);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}