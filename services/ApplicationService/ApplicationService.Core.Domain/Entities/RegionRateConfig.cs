using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// General building-estimator configuration per region.
    /// One active row per regional database.
    /// Covers area limits, storey rules, professional fee rate, and benchmark year.
    /// </summary>
    public class RegionRateConfig : TransactionBaseEntity
    {
        /// <summary>Region code: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        /// <summary>Unit of built-up area used in this region: sqft | sqm</summary>
        public string AreaUnit { get; set; } = "sqm";

        /// <summary>Minimum allowed built-up area (in AreaUnit).</summary>
        public decimal AreaMin { get; set; }

        /// <summary>Maximum allowed built-up area (in AreaUnit).</summary>
        public decimal AreaMax { get; set; }

        /// <summary>
        /// Percentage added to construction cost per extra storey above ground floor.
        /// e.g. 0.05 = 5% per storey → 2 storeys = ×1.05, 3 storeys = ×1.10.
        /// </summary>
        public decimal StoreyIncrementPct { get; set; } = 0.05m;

        /// <summary>Maximum number of storeys accepted in the estimator.</summary>
        public int MaxStoreys { get; set; } = 5;

        /// <summary>
        /// Professional / architect fee rate applied on top of construction cost.
        /// e.g. 0.10 = 10%.
        /// </summary>
        public decimal ProfessionalFeeRate { get; set; } = 0.10m;

        /// <summary>
        /// Reference/benchmark year displayed in the UI disclaimer.
        /// e.g. 2024.
        /// </summary>
        public int BenchmarkYear { get; set; } = 2024;

        public bool IsActive { get; set; } = true;
    }
}
