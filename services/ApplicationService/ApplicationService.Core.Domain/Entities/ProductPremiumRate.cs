using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Building and content base rates per region.
    /// One active row per regional database.
    /// Rates are expressed as decimals — e.g. 0.001 = 0.1%.
    /// </summary>
    public class ProductPremiumRate : TransactionBaseEntity
    {
        /// <summary>Region identifier: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        /// <summary>Rate applied to BuildingSumInsured. e.g. 0.001 = 0.1%</summary>
        public decimal BuildingRate { get; set; }

        /// <summary>Rate applied to ContentSumInsured. e.g. 0.0015 = 0.15%</summary>
        public decimal ContentRate { get; set; }

        // ── Regional sum-insured limits (in local currency) ───────────────────
        public decimal MinBuildingSum { get; set; }
        public decimal? MaxBuildingSum { get; set; }
        public decimal MinContentSum { get; set; }
        public decimal? MaxContentSum { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
