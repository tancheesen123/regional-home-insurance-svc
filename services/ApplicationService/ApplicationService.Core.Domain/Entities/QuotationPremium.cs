using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class QuotationPremium : TransactionBaseEntity
    {
        public string QuotationId { get; set; } = string.Empty;

        // Plan premium (building + contents, before add-ons)
        public decimal PlanPremium { get; set; }

        // Add-on premiums total
        public decimal AddOnPremium { get; set; }

        // Gross premium = PlanPremium + AddOnPremium (before discount)
        public decimal GrossPremium { get; set; }

        // Discount
        public decimal DiscountAmount { get; set; }

        // Net premium = GrossPremium − DiscountAmount
        public decimal NetPremium { get; set; }

        // Tax
        public decimal TaxRate { get; set; }        // e.g. 6 for 6 %
        public decimal TaxAmount { get; set; }

        // Stamp duty
        public decimal StampDuty { get; set; }

        // Final totals
        public decimal TotalPremium { get; set; }          // NetPremium + TaxAmount + StampDuty
        public decimal TotalBeforeDiscount { get; set; }   // GrossPremium path (no discount)

        // Navigation
        public Quotation Quotation { get; set; } = null!;
    }
}
