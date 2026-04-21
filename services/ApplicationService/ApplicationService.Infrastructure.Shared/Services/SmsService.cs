using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Infrastructure.Shared.Services
{
    /// <summary>
    /// Stub implementation of ISmsService.
    /// Replace with your SMS gateway SDK (e.g. EPP Conversation, Twilio, Vonage).
    /// </summary>
    public class SmsService : ISmsService
    {
        private readonly ILogger<SmsService> _logger;

        public SmsService(ILogger<SmsService> logger)
        {
            _logger = logger;
        }

        public Task<bool> SendSmsAsync(
            string mobileNumber,
            string countryCode,
            string message,
            string sourceRefId)
        {
            _logger.LogInformation(
                "SmsService.SendSmsAsync (stub) | Ref={RefId} To={Mobile} Country={Country} Message={Message}",
                sourceRefId, mobileNumber, countryCode, message);

            // TODO: Integrate a real SMS gateway.
            // Example with Twilio:
            //   var sms = await _twilioClient.Messages.CreateAsync(
            //       to:   new PhoneNumber(mobileNumber),
            //       from: new PhoneNumber(_settings.FromNumber),
            //       body: message);
            //   return sms.Status != MessageStatus.Failed;

            return Task.FromResult(true);
        }
    }
}
