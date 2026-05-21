using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Risk and underwriting multipliers used in the initial quote calculation.
    /// Each row is one named factor; the backend multiplies the base premium by the
    /// stored value when that factor applies.
    ///
    /// FactorKey conventions
    /// ─────────────────────
    /// construction.full-brick      Base rate for full-brick (typically 1.00)
    /// construction.partial-brick   Surcharge for partial-brick (e.g. 1.30)
    /// storey.1                     1-storey multiplier (typically 1.00)
    /// storey.2                     2-storey multiplier (e.g. 1.10)
    /// storey.3plus                 3+ storey multiplier (e.g. 1.20)
    /// risk.flooding                Flooding risk loading (e.g. 1.25)
    /// risk.unoccupied              Unoccupied property loading (e.g. 1.20)
    /// risk.previous-loss           Previous loss loading (e.g. 1.15)
    /// base.premium                 Fixed base premium before any multiplier (e.g. 500)
    /// </summary>
    public class RiskMultiplierConfig : TransactionBaseEntity
    {
        /// <summary>
        /// Region this factor applies to, or "ALL" for factors shared across all regions.
        /// </summary>
        public string Region { get; set; } = "ALL";

        /// <summary>
        /// Unique key for this factor (see class-level summary for valid keys).
        /// </summary>
        public string FactorKey { get; set; } = string.Empty;

        /// <summary>
        /// The multiplier (or fixed base amount for base.premium).
        /// e.g. 1.25, 1.00, 500.
        /// </summary>
        public decimal Multiplier { get; set; }

        /// <summary>Optional description shown on the admin dashboard.</summary>
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
