using ApplicationService.Core.Application.QuotationService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

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

        public async Task<RegionConfig?> GetRegionConfigAsync(string region)
        {
            return await _resolver.Resolve().RegionConfigs
                .Where(r => r.Region == region && r.IsActive)
                .FirstOrDefaultAsync();
        }

        public async Task<Dictionary<string, string>> GetAddOnIdsByCodesAsync(IEnumerable<string> codes)
        {
            var codeList = codes.ToList();
            return await _resolver.Resolve().AddOns
                .Where(a => codeList.Contains(a.Code) && a.IsActive)
                .ToDictionaryAsync(a => a.Code, a => a.Id);
        }

        public async Task ReplaceAddOnsAsync(string quotationId, IEnumerable<string> addOnIds)
        {
            var ctx      = _resolver.Resolve();
            var existing = await ctx.QuotationAddOns
                .Where(qa => qa.QuotationId == quotationId)
                .ToListAsync();

            ctx.QuotationAddOns.RemoveRange(existing);

            foreach (var addOnId in addOnIds)
            {
                ctx.QuotationAddOns.Add(new QuotationAddOn
                {
                    QuotationId = quotationId,
                    AddOnId     = addOnId
                });
            }
        }

        public async Task SaveChangesAsync()
        {
            await _resolver.Resolve().SaveChangesAsync();
        }
    }
}
