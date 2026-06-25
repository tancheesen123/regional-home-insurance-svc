using ApplicationService.Core.Application.ProposalService.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace ApplicationService.Infrastructure.Shared.Services
{
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


            return Task.FromResult(true);
        }
    }
}
