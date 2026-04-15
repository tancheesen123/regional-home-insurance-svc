namespace ApplicationService.Core.Application.QuotationService.DTOs
{
    public class SubmitPolicyRequest
    {
        public string QuotationId { get; set; }
        public PersonalDetailsDto PersonalDetails { get; set; }
        public PolicyAddressDto PropertyAddress { get; set; }
        public MailingAddressDto MailingAddress { get; set; }
        public BankDetailsDto BankDetails { get; set; }
    }

    public class PersonalDetailsDto
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

    public class PolicyAddressDto
    {
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Postcode { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
    }

    public class MailingAddressDto
    {
        public bool SameAsPropertyAddress { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Postcode { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
    }

    public class BankDetailsDto
    {
        public string? BankName { get; set; }
        public string? AccountNumber { get; set; }
    }
}
