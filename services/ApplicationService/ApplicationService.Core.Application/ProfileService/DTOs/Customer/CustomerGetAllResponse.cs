namespace ApplicationService.Core.Application.ProfileService.DTOs.Customer
{
    public class AddressDto
    {
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Postcode { get; set; }
        public string? State { get; set; }
    }

    public class CustomerGetAllResponse
    {
        public List<CustomerDetail> Customers { get; set; } = new();
    }

    public class CustomerDetail
    {
        public string CustomerId { get; set; }
        public string Name { get; set; }
        public string IcNumber { get; set; }
        public string? AddressId { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string Region { get; set; }
        public string UserId { get; set; }
    }

    public class GetCustomerByUserIdResponse
    {
        public string CustomerId { get; set; }
        public string Name { get; set; }
        public string IcNumber { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string Region { get; set; }
        public string UserId { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public AddressDto? Address { get; set; }
    }

    public class UpdateCustomerRequest
    {
        public string Name { get; set; }
        public string IcNumber { get; set; }
        public string Contact { get; set; }
        public AddressDto Address { get; set; }
    }

    public class UploadProfilePictureResponse
    {
        public string CustomerId { get; set; }
        public string ProfilePictureUrl { get; set; }
        public string Message { get; set; }
    }

    public class UpdateCustomerResponse
    {
        public string CustomerId { get; set; }
        public string Name { get; set; }
        public string IcNumber { get; set; }
        public string Contact { get; set; }
        public AddressDto? Address { get; set; }
        public string Message { get; set; }
    }
}
