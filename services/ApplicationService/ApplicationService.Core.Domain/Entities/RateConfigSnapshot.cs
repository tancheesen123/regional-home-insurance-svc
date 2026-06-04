using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Full JSON snapshot of all rate config for one region, taken automatically
    /// after every admin save.  Used to restore a region to a previous state.
    /// The JSON shape mirrors GET /api/rateconfig/building-config.
    /// </summary>
    public class RateConfigSnapshot : TransactionBaseEntity
    {
        /// <summary>Region code: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        /// <summary>
        /// Optional human-readable label set by the admin or by the system.
        /// e.g. "Before Q2 2025 rate review" | "Restored from SNAP-2025-001"
        /// </summary>
        public string Label { get; set; } = string.Empty;

        /// <summary>
        /// Complete config for this region serialised as JSON.
        /// Shape is identical to GET /api/rateconfig/building-config response.
        /// </summary>
        public string SnapshotJson { get; set; } = "{}";

        /// <summary>
        /// How this snapshot was created.
        /// auto     — taken automatically when admin saved a change
        /// manual   — admin explicitly clicked "Save snapshot"
        /// restored — system snapshot taken before a restore was applied
        /// </summary>
        public string SnapshotType { get; set; } = "auto";

        /// <summary>
        /// Field-level change logs serialised as JSON array — replaces RateConfigChangeLog table.
        /// Shape: [{ "tableName": "...", "recordId": "...", "fieldName": "...", "oldValue": "...", "newValue": "...", "changedBy": "...", "changedAt": "..." }]
        /// </summary>
        public string ChangeLogsJson { get; set; } = "[]";
    }
}
