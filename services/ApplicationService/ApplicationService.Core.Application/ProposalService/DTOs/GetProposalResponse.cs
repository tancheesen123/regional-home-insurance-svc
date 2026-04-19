namespace ApplicationService.Core.Application.ProposalService.DTOs
{
    public class GetProposalResponse
    {
        // ── Proposal ──────────────────────────────────────────────────────────
        public string ProposalId { get; set; }
        public string Status { get; set; }          // "PENDING" | "INFORCED" | "CANCELLED"
        public string CustomerId { get; set; }

        // Personal details
        public ProposalPersonalDetailsDto PersonalDetails { get; set; }

        // Addresses
        public ProposalAddressDto PropertyAddress { get; set; }
        public ProposalMailingAddressDto MailingAddress { get; set; }

        // Bank details
        public ProposalBankDetailsDto BankDetails { get; set; }

        // ── Quotation snapshot ────────────────────────────────────────────────
        public QuotationSnapshotDto Quotation { get; set; }
    }

    public class QuotationSnapshotDto
    {
        public string QuotationId { get; set; }
        public string QuotationStatus { get; set; }   // "LOCKED"
        public string Region { get; set; }

        // Property & risk info
        public string OwnershipType { get; set; }
        public string PropertyType { get; set; }
        public string? PropertySubType { get; set; }
        public int NumberOfStorey { get; set; }
        public string ConstructionType { get; set; }
        public string Postcode { get; set; }
        public bool CurrentFlooding { get; set; }
        public bool UnoccupiedProperty { get; set; }
        public bool PreviousLoss { get; set; }

        // Plan
        public string? PlanType { get; set; }
        public decimal? BuildingSum { get; set; }
        public decimal? ContentsSum { get; set; }

        // Add-ons
        public AddOnSelectionDto AddOns { get; set; }

        // Premium summary
        public decimal TotalPremium { get; set; }
        public decimal AnnualPremium { get; set; }
        public decimal MonthlyPremium { get; set; }

        // Full premium breakdown (null if CustomizePlan was never called)
        public PremiumBreakdownDto? PremiumBreakdown { get; set; }

        // Coverage dates
        public string CoverageStartDate { get; set; }
        public string ExpiryDate { get; set; }

        // Valuables
        public List<ValuableItemSnapshotDto> ValuableItems { get; set; } = new();
    }

    public class PremiumBreakdownDto
    {
        public decimal PlanPremium { get; set; }
        public decimal AddOnPremium { get; set; }
        public decimal GrossPremium { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal NetPremium { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal StampDuty { get; set; }
        public decimal TotalPremium { get; set; }
        public decimal TotalBeforeDiscount { get; set; }
    }

    public class AddOnSelectionDto
    {
        public bool RiotStrike { get; set; }
        public bool ExtendedTheft { get; set; }
        public bool AlternativeAccommodation { get; set; }
        public bool PublicLiability { get; set; }
    }

    public class ValuableItemSnapshotDto
    {
        public string ItemId { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public decimal Value { get; set; }
    }
}
