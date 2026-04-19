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

        public async Task<ProductPremiumRate?> GetPremiumRateAsync(string region)
        {
            return await _resolver.Resolve().ProductPremiumRates
                .Where(r => r.Region == region && r.IsActive)
                .FirstOrDefaultAsync();
        }

        public async Task<List<AddOn>> GetAddOnsAsync(List<string> codes)
        {
            return await _resolver.Resolve().AddOns
                .Where(a => codes.Contains(a.Code) && a.IsActive)
                .ToListAsync();
        }

        public async Task<Dictionary<string, decimal>> GetAddOnRatesAsync(string region, List<string> codes)
        {
            return await _resolver.Resolve().AddOnRates
                .Where(r => codes.Contains(r.AddOnCode) && r.Region == region && r.IsActive)
                .ToDictionaryAsync(r => r.AddOnCode, r => r.Rate);
        }

        public async Task<TaxConfig?> GetTaxConfigAsync(string region)
        {
            return await _resolver.Resolve().TaxConfigs
                .Where(t => t.Region == region && t.IsActive)
                .FirstOrDefaultAsync();
        }
    }
}
