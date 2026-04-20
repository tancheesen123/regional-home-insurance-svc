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

        public Task UpdateQuotationPlanAsync(Quotation quotation)
        {
            _resolver.Resolve().Quotations.Update(quotation);
            return Task.CompletedTask;
        }

        public async Task<List<ValuableItem>> GetValuablesByQuotationIdAsync(string quotationId)
        {
            return await _resolver.Resolve().ValuableItems
                .Where(v => v.QuotationId == quotationId)
                .ToListAsync();
        }

        public async Task ReplaceValuableItemsAsync(string quotationId, List<ValuableItem> newItems)
        {
            var context  = _resolver.Resolve();
            var existing = await context.ValuableItems
                .Where(v => v.QuotationId == quotationId)
                .ToListAsync();

            if (existing.Any())
                context.ValuableItems.RemoveRange(existing);

            if (newItems.Any())
                await context.ValuableItems.AddRangeAsync(newItems);
        }

        public async Task<Dictionary<string, ValuableCategoryRate>> GetValuableCategoryRatesAsync(string region)
        {
            return await _resolver.Resolve().ValuableCategoryRates
                .Where(r => r.Region == region && r.IsActive)
                .ToDictionaryAsync(r => r.Category.ToLower());
        }

        public async Task UpsertQuotationPremiumAsync(QuotationPremium premium)
        {
            var context  = _resolver.Resolve();
            var existing = await context.QuotationPremiums
                .FirstOrDefaultAsync(p => p.QuotationId == premium.QuotationId);

            if (existing != null)
                context.QuotationPremiums.Remove(existing);

            await context.QuotationPremiums.AddAsync(premium);
        }

        public async Task SaveChangesAsync()
        {
            await _resolver.Resolve().SaveChangesAsync();
        }
    }
}
