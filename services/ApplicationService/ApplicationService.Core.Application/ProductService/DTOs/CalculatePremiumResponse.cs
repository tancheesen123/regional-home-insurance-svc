namespace ApplicationService.Core.Application.ProductService.DTOs
{
    public class CalculatePremiumResponse
    {
        public int PlanType { get; set; }
        public decimal BuildingSumInsured { get; set; }
        public decimal ContentSumInsured { get; set; }

        public decimal BuildingRate { get; set; }
        public decimal ContentRate { get; set; }
        public decimal BuildingPremium { get; set; }
        public decimal ContentPremium { get; set; }

        public decimal PlanPremium { get; set; }

        public List<AddOnBreakdown> AddOnBreakdowns { get; set; } = new();
        public decimal TotalAddOnPremium { get; set; }

        public decimal GrossPremium { get; set; }

        public decimal DiscountAmount { get; set; }

        public decimal NetPremium { get; set; }

        public decimal ServiceTaxRate { get; set; }
        public decimal ServiceTaxAmount { get; set; }
        public decimal StampDutyAmount { get; set; }

        public decimal TotalPremium { get; set; }

        public decimal TotalBeforeDiscount { get; set; }

        public string StartDate { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
    }

    public class AddOnBreakdown
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal SumInsured { get; set; }
        public decimal Rate { get; set; }
        public decimal Premium { get; set; }
    }
}
