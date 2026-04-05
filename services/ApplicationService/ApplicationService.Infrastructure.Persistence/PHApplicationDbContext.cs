using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence
{
    public class PHApplicationDbContext : ApplicationDbContext
    {
        public PHApplicationDbContext(DbContextOptions<PHApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
