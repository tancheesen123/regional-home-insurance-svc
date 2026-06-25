using ApplicationService.Core.Application.ProfileService.DTOs.Customer;

namespace ApplicationService.Core.Application.AuthService.DTOs.Auth
{
    public class RegisterRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Nationality { get; set; }
        public string? IdType { get; set; }
        public string IdNumber { get; set; }
        public string Contact { get; set; }
        public string Region { get; set; }
        public AddressDto? Address { get; set; }
    }
}
