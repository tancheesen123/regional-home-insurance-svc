namespace ApplicationService.Core.Application.ProposalService.Interfaces.Services
{
    public interface ISmsService
    {
        Task<bool> SendSmsAsync(string mobileNumber, string countryCode, string message, string sourceRefId);
    }
}
