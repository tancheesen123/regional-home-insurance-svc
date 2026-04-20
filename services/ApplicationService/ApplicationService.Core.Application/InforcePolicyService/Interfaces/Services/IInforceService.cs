namespace ApplicationService.Core.Application.InforcePolicyService.Interfaces.Services
{
    /// <summary>
    /// Triggers asynchronous backend processing after a policy is inforced:
    /// PDF generation, email/SMS dispatch, downstream system notifications.
    /// </summary>
    public interface IInforceService
    {
        Task BackendInvokeAsync(BackendInvokeRequest request);
    }

    public class BackendInvokeRequest
    {
        public string ProposalId   { get; set; } = string.Empty;
        public string PolicyId     { get; set; } = string.Empty;
        public string PolicyNumber { get; set; } = string.Empty;
        public string Region       { get; set; } = string.Empty;
        public bool   SendEmail    { get; set; }
        public bool   SendSms      { get; set; }
    }
}
