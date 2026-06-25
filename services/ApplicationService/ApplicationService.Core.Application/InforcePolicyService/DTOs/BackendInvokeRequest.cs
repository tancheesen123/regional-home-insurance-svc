namespace ApplicationService.Core.Application.InforcePolicyService.DTOs
{
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
