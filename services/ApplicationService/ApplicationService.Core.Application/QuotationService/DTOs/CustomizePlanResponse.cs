namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class CustomizePlanResponse
    {
        public string QuotationId { get; set; }
        public string PlanType { get; set; }
        public decimal? BuildingSum { get; set; }
        public decimal? ContentsSum { get; set; }

        // Premium breakdown
        public decimal BasePremium { get; set; }
        public decimal AddOnsPremium { get; set; }
        public decimal TotalPremium { get; set; }
        public decimal AnnualPremium { get; set; }
        public decimal MonthlyPremium { get; set; }

        public AddOnBreakdownDto AddOnBreakdown { get; set; }
    }

    public class AddOnBreakdownDto
    {
        public decimal RiotStrike { get; set; }
        public decimal ExtendedTheft { get; set; }
        public decimal AlternativeAccommodation { get; set; }
        public decimal PublicLiability { get; set; }
    }
}
