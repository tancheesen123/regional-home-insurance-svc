namespace ApplicationService.Core.Application.ProductService.DTOs
{
    public class CalculatePremiumResponse
    {
        // ── Inputs echoed back ──────────────────────────────────────────────
        public int PlanType { get; set; }
        public decimal BuildingSumInsured { get; set; }
        public decimal ContentSumInsured { get; set; }

        // ── Base premium breakdown ──────────────────────────────────────────
        public decimal BuildingRate { get; set; }
        public decimal ContentRate { get; set; }
        public decimal BuildingPremium { get; set; }
        public decimal ContentPremium { get; set; }

        /// <summary>BuildingPremium + ContentPremium</summary>
        public decimal PlanPremium { get; set; }

        // ── Add-ons ─────────────────────────────────────────────────────────
        public List<AddOnBreakdown> AddOnBreakdowns { get; set; } = new();
        public decimal TotalAddOnPremium { get; set; }

        // ── Premium flow ────────────────────────────────────────────────────
        /// <summary>PlanPremium + TotalAddOnPremium</summary>
        public decimal GrossPremium { get; set; }

        public decimal DiscountAmount { get; set; }

        /// <summary>GrossPremium − DiscountAmount</summary>
        public decimal NetPremium { get; set; }

        // ── Tax & duty ──────────────────────────────────────────────────────
        public decimal ServiceTaxRate { get; set; }
        public decimal ServiceTaxAmount { get; set; }
        public decimal StampDutyAmount { get; set; }

        /// <summary>NetPremium + ServiceTaxAmount + StampDutyAmount</summary>
        public decimal TotalPremium { get; set; }

        /// <summary>GrossPremium (pre-discount) + ServiceTax(pre-discount) + StampDuty</summary>
        public decimal TotalBeforeDiscount { get; set; }

        // ── Dates ───────────────────────────────────────────────────────────
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
