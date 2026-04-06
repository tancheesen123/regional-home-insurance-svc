namespace ApplicationService.Core.Domain.Entities
{
    public class Customer
    {
        public string CustomerId { get; set; }
        public string Name { get; set; }
        public string IcNumber { get; set; }
        public string Address { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string Region { get; set; } // "KH", "PH", "ID"
        public string UserId { get; set; }

        // Navigation
        public UserAccount UserAccount { get; set; }
        public ICollection<Quotation> Quotations { get; set; }
        public ICollection<Proposal> Proposals { get; set; }
    }
}
