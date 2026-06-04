using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Customer : TransactionBaseEntity
    {
        public string CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Gender { get; set; }         // "Male", "Female", "Other"
        public string? Nationality { get; set; }
        public string? IdType { get; set; }         // "MyKad", "Passport", etc.
        public string IdNumber { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string Region { get; set; }          // "KH", "PH", "ID"
        public string UserId { get; set; }

        // ── Address (embedded — was AddressEntity) ────────────────────────────
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Postcode { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }

        // Navigation
        public UserAccount UserAccount { get; set; }
        public ICollection<Quotation> Quotations { get; set; }
        public ICollection<Proposal> Proposals { get; set; }
    }
}
