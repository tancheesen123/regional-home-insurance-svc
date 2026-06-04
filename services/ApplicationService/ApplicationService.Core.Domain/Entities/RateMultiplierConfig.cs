using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Merged multiplier table — replaces LocationTierConfig and RiskMultiplierConfig.
    /// Discriminated by Type: "location_tier" | "risk_factor".
    /// </summary>
    public class RateMultiplierConfig : TransactionBaseEntity
    {
        public string Region { get; set; } = "ALL";          // ALL | PH | ID | KH
        public string Type { get; set; } = string.Empty;     // "location_tier" | "risk_factor"
        public string FactorKey { get; set; } = string.Empty;// e.g. "prime" | "risk.flooding"
        public decimal Multiplier { get; set; }
        public string Label { get; set; } = string.Empty;

        /// <summary>JSON array of province keywords — populated for location_tier only.</summary>
        public string? KeywordsJson { get; set; }

        /// <summary>Human-readable description — populated for risk_factor only.</summary>
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
