using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class AddOn : TransactionBaseEntity
    {
        public string Code { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string EligiblePlanTypes { get; set; } = string.Empty;

        public string SumInsuredBasis { get; set; } = "Building";

        public bool IsActive { get; set; } = true;

        public string RatesJson { get; set; } = "{}";

        public ICollection<QuotationAddOn> QuotationAddOns { get; set; } = new List<QuotationAddOn>();
    }
}
