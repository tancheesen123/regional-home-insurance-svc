using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence
{
    public class KHApplicationDbContext : ApplicationDbContext
    {
        public KHApplicationDbContext(DbContextOptions<KHApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
