using ApplicationService.Core.Application.QuotationService.DTOs;

namespace ApplicationService.Core.Application.QuotationService.Interfaces.Services
{
    public interface IQuotationService
    {
        Task<GetQuoteResponse> GetQuoteAsync(GetQuoteRequest request, string region);
        Task<CustomizePlanResponse> CustomizePlanAsync(CustomizePlanRequest request);
        Task<DeclareValuablesResponse> DeclareValuablesAsync(DeclareValuablesRequest request);
        Task<SubmitPolicyResponse> SubmitPolicyAsync(SubmitPolicyRequest request);
    }
}
