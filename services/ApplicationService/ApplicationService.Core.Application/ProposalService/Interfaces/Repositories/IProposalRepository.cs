using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.ProposalService.Interfaces.Repositories
{
    public interface IProposalRepository
    {
        Task<Proposal?> GetByIdAsync(string proposalId);

        /// <summary>
        /// Returns the proposal with all related data eagerly loaded:
        /// Quotation (including ValuableItems).
        /// </summary>
        Task<Proposal?> GetByIdWithDetailsAsync(string proposalId);

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

        Task SaveChangesAsync();
    }
}
