using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class CustomerPaymentMethod : TransactionBaseEntity
    {
        public string PaymentMethodId { get; set; }
        public string CustomerId { get; set; }
        public string CardType { get; set; }        // "VISA", "Mastercard", "AMEX"
        public string LastFourDigits { get; set; }
        public string ExpiryMonth { get; set; }     // "12"
        public string ExpiryYear { get; set; }      // "2026"
        public string CardHolderName { get; set; }
        public bool IsPrimary { get; set; }

        // Navigation
        public Customer Customer { get; set; }
    }
}
