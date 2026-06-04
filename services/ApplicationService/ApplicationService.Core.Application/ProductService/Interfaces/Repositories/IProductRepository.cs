using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.ProductService.Interfaces.Repositories
{
    public interface IProductRepository
    {
        /// <summary>Returns the active region config (rates + tax + building calculator) for the given region.</summary>
        Task<RegionConfig?> GetRegionConfigAsync(string region);

        /// <summary>Returns add-on definitions for the given codes (active only). Rates are in AddOn.RatesJson.</summary>
        Task<List<AddOn>> GetAddOnsAsync(List<string> codes);
    }
}
