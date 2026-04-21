namespace ApplicationService.Core.Application.InforcePolicyService.DTOs
{
    /// <summary>
    /// Payload passed from InforcePolicyService into the background processing pipeline.
    /// </summary>
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
