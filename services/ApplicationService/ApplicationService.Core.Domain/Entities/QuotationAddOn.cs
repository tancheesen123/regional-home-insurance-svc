namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Junction table recording which AddOns were selected for a Quotation.
    /// Provides the M:N FK relationship between Quotation and AddOn.
    /// The boolean flags on Quotation (HasRiotStrike etc.) remain as a
    /// denormalised snapshot for fast reads.
    /// </summary>
    public class QuotationAddOn
    {
        public string QuotationId { get; set; } = string.Empty;
        public string AddOnId     { get; set; } = string.Empty;

        // Navigation
        public Quotation Quotation { get; set; } = null!;
        public AddOn     AddOn     { get; set; } = null!;
    }
}
