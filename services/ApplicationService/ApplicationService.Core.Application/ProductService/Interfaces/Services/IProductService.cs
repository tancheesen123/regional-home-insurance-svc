using ApplicationService.Core.Application.ProductService.DTOs;

namespace ApplicationService.Core.Application.ProductService.Interfaces.Services
{
    public interface IProductService
    {
        /// <summary>
        /// Calculates the full premium breakdown for the given plan inputs.
        /// Steps performed: Validate → Base premium → Add-ons → Discount → Dates → Service Tax → Stamp Duty.
        /// </summary>
        Task<CalculatePremiumResponse> CalculatePremiumAsync(CalculatePremiumRequest request, string region);
    }
}
