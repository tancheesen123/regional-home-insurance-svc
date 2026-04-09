using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class PaymentGateway : TransactionBaseEntity
    {
        public string Name { get; set; }
        public string ApiKey { get; set; }
        public string SupportedRegions { get; set; } // JSON

        // Navigation
        public ICollection<Payment> Payments { get; set; }
    }
}
