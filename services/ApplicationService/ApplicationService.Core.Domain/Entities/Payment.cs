using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Payment : TransactionBaseEntity
    {
        public string PaymentId { get; set; }

        /// <summary>Internal reference number shown on payment page.</summary>
        public string ReferenceNumber { get; set; }

        public decimal Amount { get; set; }
        public string Currency { get; set; }

        /// <summary>"PENDING" | "SUCCESS" | "FAILED" | "CANCELLED"</summary>
        public string Status { get; set; }

        /// <summary>"credit-card" | "debit-card" | "online-banking" | "fpx"</summary>
        public string? PaymentMethod { get; set; }

        public string? GatewayName { get; set; }

        /// <summary>Gateway transaction ID — populated on callback.</summary>
        public string? TransactionId { get; set; }

        /// <summary>Redirect URL handed to the gateway for checkout.</summary>
        public string? PaymentUrl { get; set; }

        /// <summary>When the payment session expires.</summary>
        public DateTime? ExpiresAt { get; set; }

        public DateTime PaymentDate { get; set; }
        public string ProposalId { get; set; }

        // Navigation
        public Proposal Proposal { get; set; }
        public PaymentGateway PaymentGateway { get; set; }
    }
}
