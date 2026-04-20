using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class ValuableCategoryRate : TransactionBaseEntity
    {
        public string Region { get; set; } = string.Empty;     // PH | ID | KH
        public string Category { get; set; } = string.Empty;   // jewellery | gold | electronics | artwork | sports-equipment | other
        public decimal MaxPerItem { get; set; }
        public decimal MaxTotal { get; set; }
        public decimal Rate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
