namespace ApplicationService.Core.Application.InforcePolicyService.DTOs
{
    public class InforcePolicyResponse
    {
        public string  ProposalId      { get; set; } = string.Empty;
        public string  ProposalStatus  { get; set; } = string.Empty;

        public string  PolicyId        { get; set; } = string.Empty;
        public string  PolicyNumber    { get; set; } = string.Empty;
        public string  PolicyStartDate { get; set; } = string.Empty;
        public string  PolicyEndDate   { get; set; } = string.Empty;

        public string? PolicyDownloadUrl { get; set; }

        public bool    AlreadyInforced  { get; set; }

        public string  Message         { get; set; } = string.Empty;
    }
}
