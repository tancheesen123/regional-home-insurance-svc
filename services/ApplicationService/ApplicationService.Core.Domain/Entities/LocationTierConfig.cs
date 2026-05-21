using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Location-tier configuration per region.
    /// One row per region + tier (prime | urban | rural).
    /// Stores the premium multiplier, UI display label, and the province keyword list
    /// used to auto-assign a tier when the customer selects their province.
    /// </summary>
    public class LocationTierConfig : TransactionBaseEntity
    {
        /// <summary>Region code: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        /// <summary>Tier identifier: prime | urban | rural</summary>
        public string Tier { get; set; } = string.Empty;

        /// <summary>
        /// Premium multiplier applied to construction cost for this tier.
        /// e.g. 1.12 = +12% for prime locations, 0.88 = −12% for rural.
        /// </summary>
        public decimal Multiplier { get; set; }

        /// <summary>
        /// Human-readable label shown on the admin dashboard and customer UI.
        /// e.g. "Metro Manila / BGC / Makati"
        /// </summary>
        public string Label { get; set; } = string.Empty;

        /// <summary>
        /// JSON array of lowercase province/state keywords that map to this tier.
        /// e.g. ["national capital region","ncr","metro manila"]
        /// The frontend matches province selections against this list (case-insensitive contains).
        /// Rural tier typically has an empty array — it is the catch-all fallback.
        /// </summary>
        public string KeywordsJson { get; set; } = "[]";

        public bool IsActive { get; set; } = true;
    }
}
