namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class CustomizePlanRequest
    {
        public string QuotationId { get; set; }

        /// <summary>"building" | "contents" | "building-contents"</summary>
        public string PlanType { get; set; }

        /// <summary>Sum insured for the building structure (required when PlanType includes "building").</summary>
        public decimal? BuildingSum { get; set; }

        /// <summary>Sum insured for household contents (required when PlanType includes "contents").</summary>
        public decimal? ContentsSum { get; set; }

        /// <summary>Optional flat discount to apply before tax/stamp duty.</summary>
        public decimal DiscountAmount { get; set; } = 0;

        public AddOnsDto AddOns { get; set; } = new();
    }

    public class AddOnsDto
    {
        public bool RiotStrike { get; set; }
        public bool ExtendedTheft { get; set; }
        public bool AlternativeAccommodation { get; set; }
        public bool PublicLiability { get; set; }
    }
}
