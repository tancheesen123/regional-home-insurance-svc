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

        /// <summary>Returns the active region config for the given region — used to validate valuable item limits and record which rates priced the quote.</summary>
        Task<RegionConfig?> GetRegionConfigAsync(string region);

        /// <summary>
        /// Returns a Code → Id map for the given add-on codes.
        /// Used to resolve boolean add-on flags to FK IDs for the QuotationAddOn junction table.
        /// </summary>
        Task<Dictionary<string, string>> GetAddOnIdsByCodesAsync(IEnumerable<string> codes);

        /// <summary>
        /// Replaces all QuotationAddOn rows for the given quotation with the supplied add-on IDs.
        /// Called in CustomizePlanAsync every time the customer changes their add-on selection.
        /// </summary>
        Task ReplaceAddOnsAsync(string quotationId, IEnumerable<string> addOnIds);

        Task SaveChangesAsync();
    }
}
