namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
    /// <summary>
    /// Sends policy-related notification emails (with optional PDF attachments).
    /// Separate from the auth IEmailService to avoid coupling concerns.
    /// </summary>
    public interface INotificationEmailService
    {
        Task<bool> SendPolicyEmailAsync(
            string            toEmail,
            string            toName,
            string            subject,
            string            htmlBody,
            List<EmailAttachment>? attachments = null);
    }

    public class EmailAttachment
    {
        public string  FileName    { get; set; } = string.Empty;
        public byte[]  Content     { get; set; } = Array.Empty<byte>();
        public string  ContentType { get; set; } = "application/octet-stream";
    }
}
