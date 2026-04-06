namespace ApplicationService.Core.Domain.Entities
{
    public class ValuableItem
    {
        public string ItemId { get; set; }
        public string Description { get; set; }
        public decimal Value { get; set; }
        public string QuotationId { get; set; }

        // Navigation
        public Quotation Quotation { get; set; }
    }
}
