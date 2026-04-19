namespace ApplicationService.Core.Application.ProductService.DTOs
{
    public class CalculatePremiumRequest
    {
        /// <summary>1 = Building only, 2 = Content only, 3 = Building + Content</summary>
        public int PlanType { get; set; }

        /// <summary>Required for PlanType 1 or 3. Must be a multiple of RM1,000.</summary>
        public decimal? BuildingSumInsured { get; set; }

        /// <summary>Required for PlanType 2 or 3. Must be a multiple of RM1,000.</summary>
        public decimal? ContentSumInsured { get; set; }

        /// <summary>Add-on codes to include. e.g. ["E008", "E005"]</summary>
        public List<string> AddOnCodes { get; set; } = new();

        /// <summary>Coverage start date. EndDate will be StartDate + 1 year − 1 day.</summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Optional flat discount amount. Pass 0 if no discount applies.
        /// (Campaign/agent discounts are applied externally before calling this endpoint.)
        /// </summary>
        public decimal DiscountAmount { get; set; } = 0;
    }
}
