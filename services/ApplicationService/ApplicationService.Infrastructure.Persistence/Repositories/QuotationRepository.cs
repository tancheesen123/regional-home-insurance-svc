using ApplicationService.Core.Application.QuotationService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class QuotationRepository : IQuotationRepository
    {
        private readonly DbContextResolver _resolver;

        public QuotationRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        public async Task<Quotation?> GetByIdAsync(string quotationId)
        {
            return await _resolver.Resolve().Quotations
                .FirstOrDefaultAsync(q => q.QuotationId == quotationId);
        }

        public async Task AddQuotationAsync(Quotation quotation)
        {
            await _resolver.Resolve().Quotations.AddAsync(quotation);
        }

        public async Task AddProposalAsync(Proposal proposal)
        {
            await _resolver.Resolve().Proposals.AddAsync(proposal);
        }

        public async Task AddPolicyAsync(Policy policy)
        {
            await _resolver.Resolve().Policies.AddAsync(policy);
        }

        public async Task UpdateQuotationStatusAsync(string quotationId, string status)
        {
            var context   = _resolver.Resolve();
            var quotation = await context.Quotations.FirstOrDefaultAsync(q => q.QuotationId == quotationId);
            if (quotation != null)
                quotation.Status = status;
        }

        public async Task SaveChangesAsync()
        {
            await _resolver.Resolve().SaveChangesAsync();
        }
    }
}
