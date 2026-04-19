using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    /// <summary>
    /// Per-region rate for each add-on product.
    /// One row per AddOnCode in each regional database.
    /// </summary>
    public class AddOnRate : TransactionBaseEntity
    {
        /// <summary>References AddOn.Code</summary>
        public string AddOnCode { get; set; } = string.Empty;

        /// <summary>Region identifier: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        /// <summary>Rate as decimal. e.g. 0.0005 = 0.05%</summary>
        public decimal Rate { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation
        public AddOn AddOn { get; set; } = null!;
    }
}
