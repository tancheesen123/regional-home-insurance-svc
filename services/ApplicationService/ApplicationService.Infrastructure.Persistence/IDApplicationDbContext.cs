using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence
{
    public class IDApplicationDbContext : ApplicationDbContext
    {
        public IDApplicationDbContext(DbContextOptions<IDApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
