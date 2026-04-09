using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Product : TransactionBaseEntity
    {
        public string ProductId { get; set; }
        public string Name { get; set; }
        public string RegionalRate { get; set; } // JSON
        public string Description { get; set; }
        public bool IsActive { get; set; }

        // Navigation
        public ICollection<Quotation> Quotations { get; set; }
    }
}
