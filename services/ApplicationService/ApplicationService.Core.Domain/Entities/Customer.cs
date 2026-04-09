using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Customer : TransactionBaseEntity
    {
        public string CustomerId { get; set; }
        public string Name { get; set; }
        public string IcNumber { get; set; }
        public string? AddressId { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string Region { get; set; } // "KH", "PH", "ID"
        public string UserId { get; set; }
        public string? ProfilePicturePath { get; set; }

        // Navigation
        public UserAccount UserAccount { get; set; }
        public AddressEntity? Address { get; set; }
        public ICollection<Quotation> Quotations { get; set; }
        public ICollection<Proposal> Proposals { get; set; }
    }
}
