using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// One row per field that was changed in a rate config update.
    /// Linked to the RateConfigSnapshot that was taken at the same time.
    /// </summary>
    public class RateConfigChangeLog : TransactionBaseEntity
    {
        /// <summary>FK → RateConfigSnapshot.Id</summary>
        public string SnapshotId { get; set; } = string.Empty;

        /// <summary>Region code: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        /// <summary>
        /// Which table the change was made in.
        /// e.g. BuildingConstructionRates | RegionRateConfigs | LocationTierConfigs | RiskMultiplierConfigs
        /// </summary>
        public string TableName { get; set; } = string.Empty;

        /// <summary>Id of the specific row that was changed.</summary>
        public string RecordId { get; set; } = string.Empty;

        /// <summary>
        /// Human-readable field description.
        /// e.g. "bungalow / full-brick → RatePerUnit"
        ///       "prime → Multiplier"
        ///       "risk.flooding → Multiplier"
        /// </summary>
        public string FieldName { get; set; } = string.Empty;

        /// <summary>Value before the change.</summary>
        public string OldValue { get; set; } = string.Empty;

        /// <summary>Value after the change.</summary>
        public string NewValue { get; set; } = string.Empty;

        public string ChangedBy { get; set; } = string.Empty;

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public RateConfigSnapshot Snapshot { get; set; } = null!;
    }
}
