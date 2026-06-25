namespace ApplicationService.Core.Application.ProposalService.DTOs
{
    public class GetProposalResponse
    {
        public string ProposalId { get; set; }
        public string Status { get; set; }
        public string CustomerId { get; set; }

        public ProposalPersonalDetailsDto PersonalDetails { get; set; }

        public ProposalAddressDto PropertyAddress { get; set; }
        public ProposalMailingAddressDto MailingAddress { get; set; }

        public ProposalBankDetailsDto BankDetails { get; set; }

        public QuotationSnapshotDto Quotation { get; set; }
    }

    public class QuotationSnapshotDto
    {
        public string QuotationId { get; set; }
        public string QuotationStatus { get; set; }
        public string Region { get; set; }

        public string OwnershipType { get; set; }
        public string PropertyType { get; set; }
        public string? PropertySubType { get; set; }
        public int NumberOfStorey { get; set; }
        public string ConstructionType { get; set; }
        public string Postcode { get; set; }
        public bool CurrentFlooding { get; set; }
        public bool UnoccupiedProperty { get; set; }
        public bool PreviousLoss { get; set; }

        public string? PlanType { get; set; }
        public decimal? BuildingSum { get; set; }
        public decimal? ContentsSum { get; set; }

        public AddOnSelectionDto AddOns { get; set; }

        public decimal TotalPremium { get; set; }
        public decimal AnnualPremium { get; set; }
        public decimal MonthlyPremium { get; set; }

        public PremiumBreakdownDto? PremiumBreakdown { get; set; }

        public string CoverageStartDate { get; set; }
        public string ExpiryDate { get; set; }

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
