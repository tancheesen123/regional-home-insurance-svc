using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.ProposalService.Interfaces.Repositories
{
    public interface IProposalRepository
    {
        Task<Proposal?> GetByIdAsync(string proposalId);
        Task<Proposal?> GetByQuotationIdAsync(string quotationId);

        /// <summary>
        /// Atomically adds the proposal and sets the linked quotation status to "LOCKED".
        /// Both changes are flushed on the next SaveChangesAsync call.
        /// </summary>
        Task CreateProposalAndLockQuotationAsync(Proposal proposal);

        Task SaveChangesAsync();
    }
}
