using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Construction cost rate used by the building sum-insured estimator.
    /// One row per region + property sub-type + construction type combination.
    /// e.g. PH / bungalow / full-brick = 28,000 PHP per sqm.
    /// </summary>
    public class BuildingConstructionRate : TransactionBaseEntity
    {
        /// <summary>Region code: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        /// <summary>
        /// Property sub-type: bungalow | semi-detached | terrace | condo | apartment | flat
        /// </summary>
        public string PropertySubType { get; set; } = string.Empty;

        /// <summary>Construction type: full-brick | partial-brick</summary>
        public string ConstructionType { get; set; } = string.Empty;

        /// <summary>
        /// Cost per area unit in local currency.
        /// e.g. 28000 = ₱28,000 per sqm for PH bungalow full-brick.
        /// </summary>
        public decimal RatePerUnit { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
