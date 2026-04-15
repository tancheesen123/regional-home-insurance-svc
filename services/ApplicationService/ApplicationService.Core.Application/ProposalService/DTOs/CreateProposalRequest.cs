namespace ApplicationService.Core.Application.ProposalService.DTOs
{
    public class CreateProposalRequest
    {
        public string QuotationId { get; set; }
        public ProposalPersonalDetailsDto PersonalDetails { get; set; }
        public ProposalAddressDto PropertyAddress { get; set; }
        public ProposalMailingAddressDto MailingAddress { get; set; }
        public ProposalBankDetailsDto BankDetails { get; set; }
    }

    public class ProposalPersonalDetailsDto
    {
        public string Name { get; set; }
        public string? IdType { get; set; }
        public string? IdNumber { get; set; }
        public string? Nationality { get; set; }
        public string? Race { get; set; }
        public string? Gender { get; set; }
        public string? DateOfBirth { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
    }

    public class ProposalAddressDto
    {
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Postcode { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
    }

    public class ProposalMailingAddressDto
    {
        public bool SameAsPropertyAddress { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Postcode { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
    }

    public class ProposalBankDetailsDto
    {
        public string? BankName { get; set; }
        public string? AccountNumber { get; set; }
    }
}
