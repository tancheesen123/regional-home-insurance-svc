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

        Task CreateProposalAndLockQuotationAsync(Proposal proposal);
        Task InforceProposalAsync(Proposal proposal, Policy policy);
        Task AddPolicyDocumentsAsync(List<PolicyDocument> documents, string policyId, bool hasFullDocument);
        Task AddPolicyDocumentsAsync(List<PolicyDocument> documents, string policyId, bool hasFullDocument, string region);

        Task SaveChangesAsync();
        Task SaveChangesAsync(string region);
    }
}
