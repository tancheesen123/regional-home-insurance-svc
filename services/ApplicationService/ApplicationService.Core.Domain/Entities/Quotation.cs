using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Quotation : TransactionBaseEntity
    {
        public string QuotationId { get; set; }
        public string Status { get; set; }           // "QUOTED" | "CONVERTED" | "EXPIRED"
        public decimal Premium { get; set; }
        public DateTime CoverageStartDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Region { get; set; }           // "KH", "PH", "ID"
        public string CustomerId { get; set; }
        public string? ProductId { get; set; }

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

        // Navigation
        public Customer Customer { get; set; }
        public Product Product { get; set; }
        public ICollection<ValuableItem> ValuableItems { get; set; }
        public Proposal Proposal { get; set; }
    }
}
