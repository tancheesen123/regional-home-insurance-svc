using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Payment : TransactionBaseEntity
    {
        public string PaymentId { get; set; }

        public string ReferenceNumber { get; set; }

        public decimal Amount { get; set; }
        public string Currency { get; set; }

        public string Status { get; set; }

        public string? PaymentMethod { get; set; }

        public string? GatewayName { get; set; }

        public string? TransactionId { get; set; }

        public string? PaymentUrl { get; set; }

        public DateTime? ExpiresAt { get; set; }

        public DateTime PaymentDate { get; set; }
        public string ProposalId { get; set; }

        public Proposal Proposal { get; set; }
    }
}
