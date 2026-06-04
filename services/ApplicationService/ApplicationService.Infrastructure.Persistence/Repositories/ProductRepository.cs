using ApplicationService.Core.Application.ProductService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly DbContextResolver _resolver;

        public ProductRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        public async Task<RegionConfig?> GetRegionConfigAsync(string region)
        {
            return await _resolver.Resolve().RegionConfigs
                .Where(r => r.Region == region && r.IsActive)
                .FirstOrDefaultAsync();
        }

        public async Task<List<AddOn>> GetAddOnsAsync(List<string> codes)
        {
            return await _resolver.Resolve().AddOns
                .Where(a => codes.Contains(a.Code) && a.IsActive)
                .ToListAsync();
        }
    }
}
