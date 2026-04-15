namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class DeclareValuablesRequest
    {
        public string QuotationId { get; set; }

        /// <summary>
        /// Full list of valuable items to declare.
        /// Any existing items for this quotation will be replaced.
        /// Pass an empty list to remove all previously declared valuables.
        /// </summary>
        public List<ValuableItemRequest> Items { get; set; } = new();
    }

    public class ValuableItemRequest
    {
        /// <summary>
        /// "jewellery" | "electronics" | "artwork" | "sports-equipment" | "other"
        /// </summary>
        public string Category { get; set; }

        public string Description { get; set; }

        /// <summary>Declared replacement value of the item.</summary>
        public decimal Value { get; set; }
    }
}
