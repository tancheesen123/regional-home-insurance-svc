using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class Proposal : TransactionBaseEntity
    {
        public string ProposalId { get; set; }
        public string Status { get; set; }
        public string CustomerId { get; set; }
        public string QuotationId { get; set; }

        public string Name { get; set; }
        public string? IdType { get; set; }
        public string? IdNumber { get; set; }
        public string? Nationality { get; set; }
        public string? Race { get; set; }
        public string? Gender { get; set; }
        public string? DateOfBirth { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }

        public string? PropAddressLine1 { get; set; }
        public string? PropAddressLine2 { get; set; }
        public string? PropCity { get; set; }
        public string? PropPostcode { get; set; }
        public string? PropState { get; set; }
        public string? PropCountry { get; set; }
        public string? PropDistrict { get; set; }
        public string? PropVillage { get; set; }

        public bool MailingSameAsProperty { get; set; }
        public string? MailAddressLine1 { get; set; }
        public string? MailAddressLine2 { get; set; }
        public string? MailCity { get; set; }
        public string? MailPostcode { get; set; }
        public string? MailState { get; set; }
        public string? MailCountry { get; set; }
        public string? MailDistrict { get; set; }
        public string? MailVillage { get; set; }

        public string? BankName { get; set; }
        public string? BankAccountNumber { get; set; }

        public Customer Customer { get; set; }
        public Quotation Quotation { get; set; }
        public Policy Policy { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}
