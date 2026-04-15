namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class DeclareValuablesResponse
    {
        public string QuotationId { get; set; }

        public List<ValuableItemResponse> Items { get; set; } = new();

        // Valuables premium breakdown
        public decimal TotalDeclaredValue { get; set; }
        public decimal ValuablesPremium { get; set; }

        // Running totals (plan premium + valuables premium)
        public decimal PlanPremium { get; set; }
        public decimal TotalPremium { get; set; }
        public decimal AnnualPremium { get; set; }
        public decimal MonthlyPremium { get; set; }
    }

    public class ValuableItemResponse
    {
        public string ItemId { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public decimal Value { get; set; }
        public decimal ItemPremium { get; set; }
    }
}
