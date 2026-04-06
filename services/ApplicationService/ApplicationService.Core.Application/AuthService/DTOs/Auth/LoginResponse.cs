namespace ApplicationService.Core.Application.AuthService.DTOs.Auth
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
