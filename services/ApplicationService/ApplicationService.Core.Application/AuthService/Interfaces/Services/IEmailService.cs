namespace ApplicationService.Core.Application.AuthService.Interfaces.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string toEmail, string toName, string verificationLink);
    }
}
