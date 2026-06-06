using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Quotation : TransactionBaseEntity
    {
        public string QuotationId { get; set; }
        public string Status { get; set; }           // "QUOTED" | "CONVERTED" | "EXPIRED"
        public decimal Premium { get; set; }         // total tax-inclusive premium
        public DateTime CoverageStartDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Region { get; set; }           // "KH", "PH", "ID"
        public string CustomerId { get; set; }

        // FK to the RegionConfig whose rates were used to price this quote
        public string? RegionConfigId { get; set; }

        // Property & Risk Info
        public string OwnershipType { get; set; }    // "owner" | "tenant"
        public string PropertyType { get; set; }     // "landed" | "non-landed"
        public string? PropertySubType { get; set; }
        public int NumberOfStorey { get; set; }
        public string ConstructionType { get; set; } // "full-brick" | "partial-brick"
        public string Postcode { get; set; }
        public bool CurrentFlooding { get; set; }
        public bool UnoccupiedProperty { get; set; }
        public bool PreviousLoss { get; set; }

        // Applicant snapshot (for risk calculation)
        public string? IdType { get; set; }
        public string? IdNumber { get; set; }
        public string? Nationality { get; set; }
        public string? DateOfBirth { get; set; }

        // Plan & Sums Insured (populated by CustomizePlan)
        public string? PlanType { get; set; }            // "building" | "contents" | "building-contents"
        public decimal? BuildingSum { get; set; }
        public decimal? ContentsSum { get; set; }

        // Add-ons
        public bool HasRiotStrike { get; set; }
        public bool HasExtendedTheft { get; set; }
        public bool HasAlternativeAccommodation { get; set; }
        public bool HasPublicLiability { get; set; }

        // ── Premium breakdown (was QuotationPremium table) ────────────────────
        public decimal? PlanPremium { get; set; }
        public decimal? AddOnPremium { get; set; }
        public decimal? GrossPremium { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? NetPremium { get; set; }
        public decimal? TaxRate { get; set; }
        public decimal? TaxAmount { get; set; }
        public decimal? StampDuty { get; set; }
        public decimal? TotalBeforeDiscount { get; set; }

        // ── Valuable items (was ValuableItem table) ───────────────────────────
        /// <summary>
        /// JSON array of declared valuable items.
        /// Shape: [{ "itemId": "...", "category": "jewellery", "description": "...", "value": 5000 }]
        /// </summary>
        public string? ValuableItemsJson { get; set; }

        // Navigation
        public Customer    Customer      { get; set; }
        public Proposal    Proposal      { get; set; }
        public RegionConfig? RegionConfig { get; set; }
        public ICollection<QuotationAddOn> QuotationAddOns { get; set; } = new List<QuotationAddOn>();
    }
}
