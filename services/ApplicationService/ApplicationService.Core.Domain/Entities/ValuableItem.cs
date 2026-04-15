using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class ValuableItem : TransactionBaseEntity
    {
        public string ItemId { get; set; }

        /// <summary>
        /// "jewellery" | "electronics" | "artwork" | "sports-equipment" | "other"
        /// </summary>
        public string Category { get; set; }

        public string Description { get; set; }
        public decimal Value { get; set; }
        public string QuotationId { get; set; }

        // Navigation
        public Quotation Quotation { get; set; }
    }
}
