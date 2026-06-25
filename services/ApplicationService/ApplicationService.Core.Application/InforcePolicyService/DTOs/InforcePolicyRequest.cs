namespace ApplicationService.Core.Application.InforcePolicyService.DTOs
{
    public class InforcePolicyRequest
    {
        public string ProposalId { get; set; } = string.Empty;

        public bool SendEmail { get; set; } = true;

        public bool? SendSms { get; set; }

        public bool? CheckPayment { get; set; }

        public bool WithUrlLink { get; set; } = false;
    }
}
