using ApplicationService.Core.Application.ProfileService.DTOs.Customer;

namespace ApplicationService.Core.Application.AuthService.DTOs.Auth
{
    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string IcNumber { get; set; }
        public string Contact { get; set; }
        public string Region { get; set; } // PH, ID, KH
        public AddressDto? Address { get; set; }
    }
}
