using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.ProposalService.Interfaces.Repositories
{
    public interface IProposalRepository
    {
        Task<Proposal?> GetByIdAsync(string proposalId);

        /// <summary>
        /// Returns the proposal with all related data eagerly loaded:
        /// Quotation (including ValuableItems).
        /// Use the HTTP-context overload during normal requests.
        /// </summary>
        Task<Proposal?> GetByIdWithDetailsAsync(string proposalId);

        /// <summary>
        /// Background-safe overload: resolves the DbContext from an explicit region string
        /// instead of the HTTP header (use in fire-and-forget / Task.Run contexts).
        /// </summary>
        Task<Proposal?> GetByIdWithDetailsAsync(string proposalId, string region);

        Task<Proposal?> GetByQuotationIdAsync(string quotationId);

        /// <summary>
        /// Atomically adds the proposal and sets the linked quotation status to "LOCKED".
        /// Both changes are flushed on the next SaveChangesAsync call.
        /// </summary>
        Task CreateProposalAndLockQuotationAsync(Proposal proposal);

        /// <summary>
        /// Sets proposal status to "INFORCED", creates the Policy record,
        /// and sets the linked quotation status to "CONVERTED" — all in one unit-of-work.
        /// </summary>
        Task InforceProposalAsync(Proposal proposal, Policy policy);

        /// <summary>
        /// Adds policy document records and sets Policy.HasFullDocument.
        /// Use the HTTP-context overload during normal requests.
        /// </summary>
        Task AddPolicyDocumentsAsync(List<PolicyDocument> documents, string policyId, bool hasFullDocument);

        /// <summary>
        /// Background-safe overload: resolves the DbContext from an explicit region string.
        /// </summary>
        Task AddPolicyDocumentsAsync(List<PolicyDocument> documents, string policyId, bool hasFullDocument, string region);

        Task SaveChangesAsync();

        /// <summary>
        /// Background-safe overload: resolves the DbContext from an explicit region string.
        /// </summary>
        Task SaveChangesAsync(string region);
    }
}
