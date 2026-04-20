namespace ApplicationService.Core.Application.InforcePolicyService.DTOs
{
    public class InforcePolicyRequest
    {
        /// <summary>The proposal to inforce.</summary>
        public string ProposalId { get; set; } = string.Empty;

        /// <summary>Send policy-issued email notification. Default: true.</summary>
        public bool SendEmail { get; set; } = true;

        /// <summary>
        /// Send SMS notification.
        /// Default: true for PH, false for ID/KH (resolved from proposal region when null).
        /// </summary>
        public bool? SendSms { get; set; }

        /// <summary>
        /// If false, skips payment verification (agent-only bypass).
        /// Default: true.
        /// </summary>
        public bool? CheckPayment { get; set; }

        /// <summary>If true, the response includes a policy document download URL.</summary>
        public bool WithUrlLink { get; set; } = false;
    }
}
