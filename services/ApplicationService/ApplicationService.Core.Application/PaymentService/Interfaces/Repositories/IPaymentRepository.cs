using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.PaymentService.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
        Task<Payment?> GetByIdAsync(string paymentId);
        Task<Payment?> GetByReferenceNumberAsync(string referenceNumber);

        Task<Payment?> GetByTransactionIdAsync(string transactionId);

        Task<List<Payment>> GetByProposalIdAsync(string proposalId);
        Task AddPaymentAsync(Payment payment);
        void UpdatePayment(Payment payment);
        Task SaveChangesAsync();
    }
}
