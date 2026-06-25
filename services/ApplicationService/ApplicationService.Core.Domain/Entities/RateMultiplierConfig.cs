using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class RateMultiplierConfig : TransactionBaseEntity
    {
        public string Region { get; set; } = "ALL";
        public string Type { get; set; } = string.Empty;
        public string FactorKey { get; set; } = string.Empty;
        public decimal Multiplier { get; set; }
        public string Label { get; set; } = string.Empty;

        public string? KeywordsJson { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public string? RegionConfigId { get; set; }

        public RegionConfig? RegionConfig { get; set; }
    }
}
