namespace ApplicationService.Core.Domain.Entities
{
    public class Payment
    {
        public string PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; } // "SUCCESS", "FAILED", "CANCELLED"
        public string GatewayName { get; set; }
        public string TransactionId { get; set; }
        public DateTime PaymentDate { get; set; }
        public string ProposalId { get; set; }

        // Navigation
        public Proposal Proposal { get; set; }
        public PaymentGateway PaymentGateway { get; set; }
    }
}
