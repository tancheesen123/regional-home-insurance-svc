using ApplicationService.Core.Application.AuthService.Interfaces.Services;
using ApplicationService.Core.Application.AuthService.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace ApplicationService.Infrastructure.Shared.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendVerificationEmailAsync(string toEmail, string toName, string verificationLink)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = "Verify Your Email — Regional Home Insurance";

            message.Body = new TextPart("html")
            {
                Text = $@"
                    <div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;'>
                        <h2 style='color:#1a73e8;'>Welcome to Regional Home Insurance!</h2>
                        <p>Hi <strong>{toName}</strong>,</p>
                        <p>Thank you for registering. Please verify your email address by clicking the button below.</p>
                        <div style='text-align:center;margin:32px 0;'>
                            <a href='{verificationLink}'
                               style='background-color:#1a73e8;color:#fff;padding:12px 28px;border-radius:4px;text-decoration:none;font-size:16px;'>
                                Verify Email
                            </a>
                        </div>
                        <p style='color:#777;font-size:13px;'>This link expires in 24 hours. If you did not create an account, please ignore this email.</p>
                    </div>"
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
