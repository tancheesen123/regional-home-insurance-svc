namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class CustomizePlanResponse
    {
        public string QuotationId { get; set; }
        public string PlanType { get; set; }
        public decimal? BuildingSum { get; set; }
        public decimal? ContentsSum { get; set; }

        // ── Premium breakdown ───────────────────────────────────────────────
        public decimal BuildingPremium { get; set; }
        public decimal ContentPremium { get; set; }

        /// <summary>BuildingPremium + ContentPremium</summary>
        public decimal PlanPremium { get; set; }

        public decimal AddOnsPremium { get; set; }

        /// <summary>PlanPremium + AddOnsPremium (before discount)</summary>
        public decimal GrossPremium { get; set; }

        public decimal DiscountAmount { get; set; }

        /// <summary>GrossPremium − Discount</summary>
        public decimal NetPremium { get; set; }

        public decimal ServiceTaxRate { get; set; }
        public decimal ServiceTaxAmount { get; set; }
        public decimal StampDutyAmount { get; set; }

        /// <summary>NetPremium + ServiceTax + StampDuty — stored in Quotation.Premium</summary>
        public decimal TotalPremium { get; set; }

        public decimal TotalBeforeDiscount { get; set; }

        public decimal AnnualPremium { get; set; }
        public decimal MonthlyPremium { get; set; }

        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public List<AddOnBreakdownDto> AddOnBreakdown { get; set; } = new();
    }

    public class AddOnBreakdownDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal Premium { get; set; }
    }
}
