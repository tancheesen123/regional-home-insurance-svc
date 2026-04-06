namespace ApplicationService.Core.Domain.Entities
{
    public class Quotation
    {
        public string QuotationId { get; set; }
        public decimal Premium { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Region { get; set; } // "KH", "PH", "ID"
        public string CustomerId { get; set; }
        public string ProductId { get; set; }

        // Navigation
        public Customer Customer { get; set; }
        public Product Product { get; set; }
        public ICollection<ValuableItem> ValuableItems { get; set; }
        public Proposal Proposal { get; set; }
    }
}
