using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using ApplicationService.Core.Application.ProposalService.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace ApplicationService.Infrastructure.Shared.Services
{
    /// <summary>
    /// Sends policy notification emails (with PDF zip attachments) via SMTP.
    /// Reuses the same SMTP settings as the auth email service.
    /// </summary>
    public class NotificationEmailService : INotificationEmailService
    {
        private readonly ILogger<NotificationEmailService> _logger;
        private readonly NotificationEmailSettings         _settings;

        public NotificationEmailService(
            ILogger<NotificationEmailService> logger,
            IOptions<NotificationEmailSettings> options)
        {
            _logger   = logger;
            _settings = options.Value;
        }

        public async Task<bool> SendPolicyEmailAsync(
            string toEmail,
            string toName,
            string subject,
            string htmlBody,
            List<EmailAttachment>? attachments = null)
        {
            var refId = $"POLICY-EMAIL-{DateTime.UtcNow.Ticks}";
            _logger.LogInformation("SendPolicyEmailAsync | Ref={RefId} To={Email}", refId, toEmail);

            try
            {
                using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
                {
                    Credentials    = new NetworkCredential(_settings.Username, _settings.Password),
                    EnableSsl      = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network
                };

                using var message = new MailMessage
                {
                    From       = new MailAddress(_settings.SenderEmail, _settings.SenderName),
                    Subject    = subject,
                    Body       = htmlBody,
                    IsBodyHtml = true
                };

                message.To.Add(new MailAddress(toEmail, toName));

                if (attachments != null)
                {
                    foreach (var att in attachments)
                    {
                        var stream     = new MemoryStream(att.Content);
                        var attachment = new Attachment(stream, att.FileName, att.ContentType);
                        message.Attachments.Add(attachment);
                    }
                }

                await client.SendMailAsync(message);

                _logger.LogInformation("Policy email sent | Ref={RefId}", refId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SendPolicyEmailAsync FAILED | Ref={RefId}", refId);
                return false;
            }
        }
    }

    public class NotificationEmailSettings
    {
        public string SmtpHost    { get; set; } = string.Empty;
        public int    SmtpPort    { get; set; } = 587;
        public string SenderEmail { get; set; } = string.Empty;
        public string SenderName  { get; set; } = string.Empty;
        public string Username    { get; set; } = string.Empty;
        public string Password    { get; set; } = string.Empty;
    }
}
