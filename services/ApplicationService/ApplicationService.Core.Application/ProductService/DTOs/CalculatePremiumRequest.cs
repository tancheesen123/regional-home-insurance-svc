namespace ApplicationService.Core.Application.ProductService.DTOs
{
    public class CalculatePremiumRequest
    {
        public int PlanType { get; set; }

        public decimal? BuildingSumInsured { get; set; }

        public decimal? ContentSumInsured { get; set; }

        public List<string> AddOnCodes { get; set; } = new();

        public DateTime StartDate { get; set; }

        public decimal DiscountAmount { get; set; } = 0;
    }
}
