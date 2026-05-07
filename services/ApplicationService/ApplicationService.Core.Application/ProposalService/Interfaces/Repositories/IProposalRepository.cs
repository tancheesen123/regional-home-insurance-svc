using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.ProposalService.Interfaces.Repositories
{
    public interface IProposalRepository
    {
        Task<Proposal?> GetByIdAsync(string proposalId);
        Task<Proposal?> GetByIdWithDetailsAsync(string proposalId);
        Task<Proposal?> GetByIdWithDetailsAsync(string proposalId, string region);
        Task<Proposal?> GetByQuotationIdAsync(string quotationId);
        Task<List<Proposal>> GetAllByCustomerIdAsync(string customerId);

        /// <summary>
        /// Returns ALL proposals belonging to a customer regardless of status,
        /// with Quotation, Policy and PolicyDocuments eagerly loaded. Ordered newest first.
        /// </summary>
        Task<List<Proposal>> GetProposalsByCustomerIdAsync(string customerId);

        /// <summary>
        /// Returns all proposals in the current region within the optional date range,
        /// with Quotation (+ QuotationPremium), Policy (+ PolicyDocuments) and Payments eagerly loaded.
        /// Date filter is applied against Policy.IssuedAt for inforced proposals,
        /// and Proposal.CreatedAt for all others. Ordered newest first.
        /// Used by the Sales reporting API.
        /// </summary>
        Task<List<Proposal>> GetSalesProposalsAsync(DateTime? dateFrom, DateTime? dateTo);

        /// <summary>
        /// Returns a single proposal by ProposalId with all sales-related data eagerly loaded:
        /// Quotation (+ QuotationPremium), Policy (+ PolicyDocuments) and Payments.
        /// </summary>
        Task<Proposal?> GetSalesRecordByProposalIdAsync(string proposalId);

        Task CreateProposalAndLockQuotationAsync(Proposal proposal);
        Task InforceProposalAsync(Proposal proposal, Policy policy);
        Task AddPolicyDocumentsAsync(List<PolicyDocument> documents, string policyId, bool hasFullDocument);
        Task AddPolicyDocumentsAsync(List<PolicyDocument> documents, string policyId, bool hasFullDocument, string region);

        Task SaveChangesAsync();
        Task SaveChangesAsync(string region);
    }
}
