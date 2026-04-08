namespace ApplicationService.Core.Application.AuthService.DTOs.Auth
{
    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string IcNumber { get; set; }
        public string Address { get; set; }
        public string Contact { get; set; }
        public string Region { get; set; } // PH, ID, KH
    }
}
