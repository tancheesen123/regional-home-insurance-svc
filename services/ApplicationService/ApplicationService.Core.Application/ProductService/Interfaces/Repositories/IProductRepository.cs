using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.ProductService.Interfaces.Repositories
{
    public interface IProductRepository
    {
        /// <summary>Returns the active premium rate row for the given region.</summary>
        Task<ProductPremiumRate?> GetPremiumRateAsync(string region);

        /// <summary>Returns add-on definitions for the given codes (active only).</summary>
        Task<List<AddOn>> GetAddOnsAsync(List<string> codes);

        /// <summary>
        /// Returns a code→rate map for the given add-on codes in the given region.
        /// Only active rows are returned.
        /// </summary>
        Task<Dictionary<string, decimal>> GetAddOnRatesAsync(string region, List<string> codes);

        /// <summary>Returns the active tax configuration for the given region.</summary>
        Task<TaxConfig?> GetTaxConfigAsync(string region);
    }
}
