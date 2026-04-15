using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.QuotationService.Interfaces.Repositories
{
    public interface IQuotationRepository
    {
        Task<Quotation?> GetByIdAsync(string quotationId);
        Task AddQuotationAsync(Quotation quotation);
        Task AddProposalAsync(Proposal proposal);
        Task AddPolicyAsync(Policy policy);
        Task UpdateQuotationStatusAsync(string quotationId, string status);
        Task UpdateQuotationPlanAsync(Quotation quotation);
        Task<List<ValuableItem>> GetValuablesByQuotationIdAsync(string quotationId);
        Task ReplaceValuableItemsAsync(string quotationId, List<ValuableItem> newItems);
        Task SaveChangesAsync();
    }
}
