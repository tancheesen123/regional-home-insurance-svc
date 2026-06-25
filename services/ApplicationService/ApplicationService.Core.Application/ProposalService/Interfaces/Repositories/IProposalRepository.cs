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

        Task<List<Proposal>> GetProposalsByCustomerIdAsync(string customerId);

        Task<List<Proposal>> GetSalesProposalsAsync(DateTime? dateFrom, DateTime? dateTo);

        Task<Proposal?> GetSalesRecordByProposalIdAsync(string proposalId);

        Task CreateProposalAndLockQuotationAsync(Proposal proposal);
        Task InforceProposalAsync(Proposal proposal, Policy policy);

        Task AddPolicyDocumentsAsync(string documentsJson, string policyId, bool hasFullDocument);
        Task AddPolicyDocumentsAsync(string documentsJson, string policyId, bool hasFullDocument, string region);

        Task SaveChangesAsync();
        Task SaveChangesAsync(string region);
    }
}
