using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.ProductService.Interfaces.Repositories
{
    public interface IProductRepository
    {
        Task<RegionConfig?> GetRegionConfigAsync(string region);

        Task<List<AddOn>> GetAddOnsAsync(List<string> codes);
    }
}
