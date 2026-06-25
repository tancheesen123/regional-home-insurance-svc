namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class DeclareValuablesRequest
    {
        public string QuotationId { get; set; }

        public List<ValuableItemRequest> Items { get; set; } = new();
    }

    public class ValuableItemRequest
    {
        public string Category { get; set; }

        public string Description { get; set; }

        public decimal Value { get; set; }
    }
}
