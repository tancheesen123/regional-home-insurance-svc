using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Merged region-level configuration — one active row per region.
    /// Replaces: ProductPremiumRate, TaxConfig, RegionRateConfig.
    /// BuildingRatesJson stores BuildingConstructionRate rows as JSON.
    /// ValuableRatesJson stores ValuableCategoryRate rows as JSON.
    /// </summary>
    public class RegionConfig : TransactionBaseEntity
    {
        public string Region { get; set; } = string.Empty;   // PH | ID | KH
        public bool IsActive { get; set; } = true;

        // ── Premium rates (was ProductPremiumRate) ────────────────────────────
        public decimal BuildingRate { get; set; }
        public decimal ContentRate { get; set; }
        public decimal MinBuildingSum { get; set; }
        public decimal? MaxBuildingSum { get; set; }
        public decimal MinContentSum { get; set; }
        public decimal? MaxContentSum { get; set; }

        // ── Tax config (was TaxConfig) ────────────────────────────────────────
        public decimal ServiceTaxRate { get; set; }
        public decimal StampDutyAmount { get; set; }
        public decimal StampDutyWaiverEligiblePremium { get; set; }

        // ── Building calculator settings (was RegionRateConfig) ───────────────
        public string AreaUnit { get; set; } = "sqm";
        public decimal AreaMin { get; set; }
        public decimal AreaMax { get; set; }
        public decimal StoreyIncrementPct { get; set; } = 0.05m;
        public int MaxStoreys { get; set; } = 5;
        public decimal ProfessionalFeeRate { get; set; } = 0.10m;
        public int BenchmarkYear { get; set; } = 2024;

        // ── JSON config (was separate tables) ────────────────────────────────
        /// <summary>
        /// BuildingConstructionRate rows serialised as JSON array.
        /// Shape: [{ "propertySubType": "bungalow", "constructionType": "full-brick", "ratePerUnit": 28000 }, ...]
        /// </summary>
        public string BuildingRatesJson { get; set; } = "[]";

        /// <summary>
        /// ValuableCategoryRate rows serialised as JSON array.
        /// Shape: [{ "category": "jewellery", "maxPerItem": 5000, "maxTotal": 20000, "rate": 0.02 }, ...]
        /// </summary>
        public string ValuableRatesJson { get; set; } = "[]";

        // Navigation
        public ICollection<Quotation>           Quotations           { get; set; } = new List<Quotation>();
        public ICollection<RateConfigSnapshot>  RateConfigSnapshots  { get; set; } = new List<RateConfigSnapshot>();
        public ICollection<RateMultiplierConfig> RateMultiplierConfigs { get; set; } = new List<RateMultiplierConfig>();
    }
}
