using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Quotation : TransactionBaseEntity
    {
        public string QuotationId { get; set; }
        public string Status { get; set; }
        public decimal Premium { get; set; }
        public DateTime CoverageStartDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Region { get; set; }
        public string CustomerId { get; set; }

        public string? RegionConfigId { get; set; }

        public string OwnershipType { get; set; }
        public string PropertyType { get; set; }
        public string? PropertySubType { get; set; }
        public int NumberOfStorey { get; set; }
        public string ConstructionType { get; set; }
        public string Postcode { get; set; }
        public bool CurrentFlooding { get; set; }
        public bool UnoccupiedProperty { get; set; }
        public bool PreviousLoss { get; set; }

        public string? IdType { get; set; }
        public string? IdNumber { get; set; }
        public string? Nationality { get; set; }
        public string? DateOfBirth { get; set; }

        public string? PlanType { get; set; }
        public decimal? BuildingSum { get; set; }
        public decimal? ContentsSum { get; set; }

        public bool HasRiotStrike { get; set; }
        public bool HasExtendedTheft { get; set; }
        public bool HasAlternativeAccommodation { get; set; }
        public bool HasPublicLiability { get; set; }

        public decimal? PlanPremium { get; set; }
        public decimal? AddOnPremium { get; set; }
        public decimal? GrossPremium { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? NetPremium { get; set; }
        public decimal? TaxRate { get; set; }
        public decimal? TaxAmount { get; set; }
        public decimal? StampDuty { get; set; }
        public decimal? TotalBeforeDiscount { get; set; }

        public string? ValuableItemsJson { get; set; }

        public Customer    Customer      { get; set; }
        public Proposal    Proposal      { get; set; }
        public RegionConfig? RegionConfig { get; set; }
        public ICollection<QuotationAddOn> QuotationAddOns { get; set; } = new List<QuotationAddOn>();
    }
}
