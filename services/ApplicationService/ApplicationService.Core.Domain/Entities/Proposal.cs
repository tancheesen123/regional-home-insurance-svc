namespace ApplicationService.Core.Domain.Entities
{
    public class Proposal
    {
        public string ProposalId { get; set; }
        public string Status { get; set; } // "PENDING", "INFORCED", "CANCELLED"
        public DateTime CreatedAt { get; set; }
        public string CustomerId { get; set; }
        public string QuotationId { get; set; }

        // Navigation
        public Customer Customer { get; set; }
        public Quotation Quotation { get; set; }
        public Policy Policy { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}
