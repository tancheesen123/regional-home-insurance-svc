namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class CustomizePlanRequest
    {
        public string QuotationId { get; set; }

        public string PlanType { get; set; }

        public decimal? BuildingSum { get; set; }

        public decimal? ContentsSum { get; set; }

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
