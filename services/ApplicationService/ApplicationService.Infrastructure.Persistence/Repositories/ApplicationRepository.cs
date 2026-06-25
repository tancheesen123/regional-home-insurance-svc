using Microsoft.EntityFrameworkCore;
using ApplicationService.Core.Domain.Entities;
using ApplicationService.Core.Application.AuthService.Interfaces.Repositories;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public ApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }




        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}