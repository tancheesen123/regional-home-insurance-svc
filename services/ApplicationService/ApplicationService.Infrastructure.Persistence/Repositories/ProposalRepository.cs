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
                .FirstOrDefaultAsync(p => p.ProposalId == proposalId);
        }

        public async Task<Proposal?> GetByIdWithDetailsAsync(string proposalId, string region)
        {
            return await _resolver.Resolve(region).Proposals
                .Include(p => p.Policy)
                .Include(p => p.Quotation)
                .FirstOrDefaultAsync(p => p.ProposalId == proposalId);
        }

        public async Task<Proposal?> GetByQuotationIdAsync(string quotationId)
        {
            return await _resolver.Resolve().Proposals
                .FirstOrDefaultAsync(p => p.QuotationId == quotationId);
        }

        public async Task<List<Proposal>> GetAllByCustomerIdAsync(string customerId)
        {
            return await _resolver.Resolve().Proposals
                .Where(p => p.CustomerId == customerId && p.Status == "INFORCED")
                .Include(p => p.Policy)
                .Include(p => p.Quotation)
                .OrderByDescending(p => p.Policy!.IssuedAt)
                .ToListAsync();
        }

        public async Task<List<Proposal>> GetProposalsByCustomerIdAsync(string customerId)
        {
            return await _resolver.Resolve().Proposals
                .Where(p => p.CustomerId == customerId)
                .Include(p => p.Quotation)
                .Include(p => p.Policy)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Proposal>> GetSalesProposalsAsync(DateTime? dateFrom, DateTime? dateTo)
        {
            var query = _resolver.Resolve().Proposals
                .Include(p => p.Policy)
                .Include(p => p.Quotation)
                .Include(p => p.Payments)
                .AsQueryable();

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

        public async Task<Proposal?> GetSalesRecordByProposalIdAsync(string proposalId)
        {
            return await _resolver.Resolve().Proposals
                .Include(p => p.Policy)
                .Include(p => p.Quotation)
                .Include(p => p.Payments)
                .FirstOrDefaultAsync(p => p.ProposalId == proposalId);
        }

        public async Task CreateProposalAndLockQuotationAsync(Proposal proposal)
        {
            var context = _resolver.Resolve();
            await context.Proposals.AddAsync(proposal);

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

            proposal.Status    = "INFORCED";
            proposal.UpdatedAt = DateTime.UtcNow;
            context.Proposals.Update(proposal);

            await context.Policies.AddAsync(policy);

            var quotation = await context.Quotations
                .FirstOrDefaultAsync(q => q.QuotationId == proposal.QuotationId);

            if (quotation != null)
            {
                quotation.Status    = "CONVERTED";
                quotation.UpdatedAt = DateTime.UtcNow;
            }
        }

        public async Task AddPolicyDocumentsAsync(string documentsJson, string policyId, bool hasFullDocument)
        {
            var context = _resolver.Resolve();
            var policy  = await context.Policies.FirstOrDefaultAsync(p => p.PolicyId == policyId);
            if (policy != null)
            {
                policy.DocumentsJson   = documentsJson;
                policy.HasFullDocument = hasFullDocument;
                policy.UpdatedAt       = DateTime.UtcNow;
            }
        }

        public async Task AddPolicyDocumentsAsync(string documentsJson, string policyId, bool hasFullDocument, string region)
        {
            var context = _resolver.Resolve(region);
            var policy  = await context.Policies.FirstOrDefaultAsync(p => p.PolicyId == policyId);
            if (policy != null)
            {
                policy.DocumentsJson   = documentsJson;
                policy.HasFullDocument = hasFullDocument;
                policy.UpdatedAt       = DateTime.UtcNow;
            }
        }

        public async Task SaveChangesAsync()
        {
            await _resolver.Resolve().SaveChangesAsync();
        }

        public async Task SaveChangesAsync(string region)
        {
            await _resolver.Resolve(region).SaveChangesAsync();
        }
    }
}
