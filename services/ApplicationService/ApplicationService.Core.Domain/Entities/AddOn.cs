using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Add-on product definition. Rates are stored separately in AddOnRate.
    /// </summary>
    public class AddOn : TransactionBaseEntity
    {
        /// <summary>Unique add-on code used in requests. e.g. E008, E005</summary>
        public string Code { get; set; } = string.Empty;

        /// <summary>Display name. e.g. RSMD, Extended Theft</summary>
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        /// <summary>
        /// Comma-separated plan types this add-on is available for.
        /// 1=Building, 2=Content, 3=Both. e.g. "1,3" means Building and Both only.
        /// </summary>
        public string EligiblePlanTypes { get; set; } = string.Empty;

        /// <summary>
        /// Which sum insured to multiply the rate against.
        /// Values: Building | Content | Both (building + content combined)
        /// </summary>
        public string SumInsuredBasis { get; set; } = "Building";

        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Per-region rates serialised as JSON — replaces AddOnRate table.
        /// Shape: { "PH": 0.001, "ID": 0.0012, "KH": 0.0008 }
        /// </summary>
        public string RatesJson { get; set; } = "{}";

        // Navigation
        public ICollection<QuotationAddOn> QuotationAddOns { get; set; } = new List<QuotationAddOn>();
    }
}
