using ApplicationService.Core.Application.ProductService.DTOs;

namespace ApplicationService.Core.Application.ProductService.Interfaces.Services
{
    public interface IProductService
    {
        Task<CalculatePremiumResponse> CalculatePremiumAsync(CalculatePremiumRequest request, string region);
    }
}
