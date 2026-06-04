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
        /// with Quotation and Policy eagerly loaded. Ordered newest first.
        /// </summary>
        Task<List<Proposal>> GetProposalsByCustomerIdAsync(string customerId);

        /// <summary>
        /// Returns all proposals in the current region within the optional date range,
        /// with Quotation, Policy and Payments eagerly loaded.
        /// </summary>
        Task<List<Proposal>> GetSalesProposalsAsync(DateTime? dateFrom, DateTime? dateTo);

        /// <summary>Returns a single proposal by ProposalId with all sales-related data eagerly loaded.</summary>
        Task<Proposal?> GetSalesRecordByProposalIdAsync(string proposalId);

        Task CreateProposalAndLockQuotationAsync(Proposal proposal);
        Task InforceProposalAsync(Proposal proposal, Policy policy);

        /// <summary>Persists policy documents as JSON and marks the policy as having full documents.</summary>
        Task AddPolicyDocumentsAsync(string documentsJson, string policyId, bool hasFullDocument);
        Task AddPolicyDocumentsAsync(string documentsJson, string policyId, bool hasFullDocument, string region);

        Task SaveChangesAsync();
        Task SaveChangesAsync(string region);
    }
}
