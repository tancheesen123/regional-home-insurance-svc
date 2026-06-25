using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class RateConfigSnapshot : TransactionBaseEntity
    {
        public string Region { get; set; } = string.Empty;

        public string Label { get; set; } = string.Empty;

        public string SnapshotJson { get; set; } = "{}";

        public string SnapshotType { get; set; } = "auto";

        public string ChangeLogsJson { get; set; } = "[]";

        public string? RegionConfigId { get; set; }

        public RegionConfig? RegionConfig { get; set; }
    }
}
