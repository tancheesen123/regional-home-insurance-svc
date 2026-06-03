using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.PaymentService.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
        Task<Payment?> GetByIdAsync(string paymentId);
        Task<Payment?> GetByReferenceNumberAsync(string referenceNumber);

        /// <summary>Finds a payment by the Stripe Checkout Session ID stored in TransactionId.</summary>
        Task<Payment?> GetByTransactionIdAsync(string transactionId);

        Task<List<Payment>> GetByProposalIdAsync(string proposalId);
        Task AddPaymentAsync(Payment payment);
        void UpdatePayment(Payment payment);
        Task SaveChangesAsync();
    }
}
