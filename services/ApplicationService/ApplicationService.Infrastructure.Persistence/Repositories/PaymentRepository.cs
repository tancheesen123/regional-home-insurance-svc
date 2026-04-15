using ApplicationService.Core.Application.PaymentService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly DbContextResolver _resolver;

        public PaymentRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        public async Task<Payment?> GetByIdAsync(string paymentId)
        {
            return await _resolver.Resolve().Payments
                .Include(p => p.Proposal)
                    .ThenInclude(pr => pr.Quotation)
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId);
        }

        public async Task<Payment?> GetByReferenceNumberAsync(string referenceNumber)
        {
            return await _resolver.Resolve().Payments
                .Include(p => p.Proposal)
                    .ThenInclude(pr => pr.Quotation)
                .FirstOrDefaultAsync(p => p.ReferenceNumber == referenceNumber);
        }

        public async Task<List<Payment>> GetByProposalIdAsync(string proposalId)
        {
            return await _resolver.Resolve().Payments
                .Where(p => p.ProposalId == proposalId)
                .ToListAsync();
        }

        public async Task<PaymentGateway?> GetGatewayByRegionAsync(string region)
        {
            // SupportedRegions is stored as a JSON array string, e.g. ["PH","ID"]
            // We do a simple string-contains check; for production use JSON_VALUE / full JSON parsing.
            var gateways = await _resolver.Resolve().PaymentGateways.ToListAsync();

            return gateways.FirstOrDefault(g =>
            {
                try
                {
                    var regions = JsonSerializer.Deserialize<List<string>>(g.SupportedRegions ?? "[]");
                    return regions != null &&
                           regions.Any(r => r.Equals(region, StringComparison.OrdinalIgnoreCase));
                }
                catch { return false; }
            });
        }

        public async Task<Payment?> GetByTransactionIdAsync(string transactionId)
        {
            return await _resolver.Resolve().Payments
                .Include(p => p.Proposal)
                    .ThenInclude(pr => pr.Quotation)
                .FirstOrDefaultAsync(p => p.TransactionId == transactionId);
        }

        public async Task AddPaymentAsync(Payment payment)
        {
            await _resolver.Resolve().Payments.AddAsync(payment);
        }

        public void UpdatePayment(Payment payment)
        {
            _resolver.Resolve().Payments.Update(payment);
        }

        public async Task SaveChangesAsync()
        {
            await _resolver.Resolve().SaveChangesAsync();
        }
    }
}
