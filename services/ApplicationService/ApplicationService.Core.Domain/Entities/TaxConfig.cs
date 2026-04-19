using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Service tax rate and stamp duty configuration per region.
    /// One active row per regional database.
    /// </summary>
    public class TaxConfig : TransactionBaseEntity
    {
        /// <summary>Region identifier: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        /// <summary>Service tax percentage. e.g. 8.0 = 8%</summary>
        public decimal ServiceTaxRate { get; set; }

        /// <summary>Fixed stamp duty amount applied when eligible.</summary>
        public decimal StampDutyAmount { get; set; }

        /// <summary>
        /// Stamp duty is waived when NetPremium is at or below this threshold.
        /// e.g. 0 means stamp duty always applies; set to a positive value to create a waiver band.
        /// </summary>
        public decimal StampDutyWaiverEligiblePremium { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
