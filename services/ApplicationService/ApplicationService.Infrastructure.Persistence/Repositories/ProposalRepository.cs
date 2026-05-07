using ApplicationService.Core.Application.ProposalService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class ProposalRepository : IProposalRepository
    {
        private readonly DbContextResolver _resolver;

        public ProposalRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        public async Task<Proposal?> GetByIdAsync(string proposalId)
        {
            return await _resolver.Resolve().Proposals
                .Include(p => p.Quotation)
                .Include(p => p.Policy)
                .FirstOrDefaultAsync(p => p.ProposalId == proposalId);
        }

        public async Task<Proposal?> GetByIdWithDetailsAsync(string proposalId)
        {
            return await _resolver.Resolve().Proposals
                .Include(p => p.Policy)
                .Include(p => p.Quotation)
                    .ThenInclude(q => q.ValuableItems)
                .Include(p => p.Quotation)
                    .ThenInclude(q => q.QuotationPremium)
                .FirstOrDefaultAsync(p => p.ProposalId == proposalId);
        }

        /// <inheritdoc />
        public async Task<Proposal?> GetByIdWithDetailsAsync(string proposalId, string region)
        {
            return await _resolver.Resolve(region).Proposals
                .Include(p => p.Policy)
                .Include(p => p.Quotation)
                    .ThenInclude(q => q.ValuableItems)
                .Include(p => p.Quotation)
                    .ThenInclude(q => q.QuotationPremium)
                .FirstOrDefaultAsync(p => p.ProposalId == proposalId);
        }

        public async Task<Proposal?> GetByQuotationIdAsync(string quotationId)
        {
            return await _resolver.Resolve().Proposals
                .FirstOrDefaultAsync(p => p.QuotationId == quotationId);
        }

        /// <inheritdoc />
        public async Task<List<Proposal>> GetAllByCustomerIdAsync(string customerId)
        {
            return await _resolver.Resolve().Proposals
                .Where(p => p.CustomerId == customerId && p.Status == "INFORCED")
                .Include(p => p.Policy)
                    .ThenInclude(pol => pol.PolicyDocuments)
                .Include(p => p.Quotation)
                .OrderByDescending(p => p.Policy!.IssuedAt)
                .ToListAsync();
        }

        /// <inheritdoc />
        public async Task<List<Proposal>> GetProposalsByCustomerIdAsync(string customerId)
        {
            return await _resolver.Resolve().Proposals
                .Where(p => p.CustomerId == customerId)
                .Include(p => p.Quotation)
                .Include(p => p.Policy)
                    .ThenInclude(pol => pol.PolicyDocuments)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        /// <inheritdoc />
        public async Task<List<Proposal>> GetSalesProposalsAsync(DateTime? dateFrom, DateTime? dateTo)
        {
            var query = _resolver.Resolve().Proposals
                .Include(p => p.Policy)
                    .ThenInclude(pol => pol!.PolicyDocuments)
                .Include(p => p.Quotation)
                    .ThenInclude(q => q!.QuotationPremium)
                .Include(p => p.Payments)
                .AsQueryable();

            // Filter by date: use Policy.IssuedAt for inforced, CreatedAt for others
            if (dateFrom.HasValue)
                query = query.Where(p =>
                    (p.Policy != null && p.Policy.IssuedAt >= dateFrom.Value) ||
                    (p.Policy == null && p.CreatedAt >= dateFrom.Value));

            if (dateTo.HasValue)
                query = query.Where(p =>
                    (p.Policy != null && p.Policy.IssuedAt <= dateTo.Value) ||
                    (p.Policy == null && p.CreatedAt <= dateTo.Value));

            return await query
                .OrderByDescending(p => p.Policy != null ? p.Policy.IssuedAt : p.CreatedAt)
                .ToListAsync();
        }

        /// <inheritdoc />
        public async Task<Proposal?> GetSalesRecordByProposalIdAsync(string proposalId)
        {
            return await _resolver.Resolve().Proposals
                .Include(p => p.Policy)
                    .ThenInclude(pol => pol!.PolicyDocuments)
                .Include(p => p.Quotation)
                    .ThenInclude(q => q!.QuotationPremium)
                .Include(p => p.Payments)
                .FirstOrDefaultAsync(p => p.ProposalId == proposalId);
        }

        public async Task CreateProposalAndLockQuotationAsync(Proposal proposal)
        {
            var context = _resolver.Resolve();

            // Add the new proposal
            await context.Proposals.AddAsync(proposal);

            // Lock the quotation in the same unit-of-work
            var quotation = await context.Quotations
                .FirstOrDefaultAsync(q => q.QuotationId == proposal.QuotationId);

            if (quotation != null)
            {
                quotation.Status    = "LOCKED";
                quotation.UpdatedAt = DateTime.UtcNow;
            }
        }

        public async Task InforceProposalAsync(Proposal proposal, Policy policy)
        {
            var context = _resolver.Resolve();

            // Inforce the proposal
            proposal.Status    = "INFORCED";
            proposal.UpdatedAt = DateTime.UtcNow;
            context.Proposals.Update(proposal);

            // Create the policy
            await context.Policies.AddAsync(policy);

            // Convert the quotation
            var quotation = await context.Quotations
                .FirstOrDefaultAsync(q => q.QuotationId == proposal.QuotationId);

            if (quotation != null)
            {
                quotation.Status    = "CONVERTED";
                quotation.UpdatedAt = DateTime.UtcNow;
            }
        }

        public async Task AddPolicyDocumentsAsync(List<PolicyDocument> documents, string policyId, bool hasFullDocument)
        {
            var context = _resolver.Resolve();

            await context.PolicyDocuments.AddRangeAsync(documents);

            var policy = await context.Policies.FirstOrDefaultAsync(p => p.PolicyId == policyId);
            if (policy != null)
                policy.HasFullDocument = hasFullDocument;
        }

        /// <inheritdoc />
        public async Task AddPolicyDocumentsAsync(List<PolicyDocument> documents, string policyId, bool hasFullDocument, string region)
        {
            var context = _resolver.Resolve(region);

            await context.PolicyDocuments.AddRangeAsync(documents);

            var policy = await context.Policies.FirstOrDefaultAsync(p => p.PolicyId == policyId);
            if (policy != null)
                policy.HasFullDocument = hasFullDocument;
        }

        public async Task SaveChangesAsync()
        {
            await _resolver.Resolve().SaveChangesAsync();
        }

        /// <inheritdoc />
        public async Task SaveChangesAsync(string region)
        {
            await _resolver.Resolve(region).SaveChangesAsync();
        }
    }
}
