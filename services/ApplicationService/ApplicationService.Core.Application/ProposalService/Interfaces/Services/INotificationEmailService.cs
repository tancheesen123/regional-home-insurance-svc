namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
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
