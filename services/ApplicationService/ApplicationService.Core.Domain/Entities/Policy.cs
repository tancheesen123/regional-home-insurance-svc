namespace ApplicationService.Core.Domain.Entities
{
    public class Policy
    {
        public string PolicyId { get; set; }
        public string PolicyNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal CoverageAmount { get; set; }
        public DateTime IssuedAt { get; set; }
        public string IssuedBy { get; set; }
        public string ProposalId { get; set; }

        // Navigation
        public Proposal Proposal { get; set; }
        public ICollection<PolicyDocument> PolicyDocuments { get; set; }
    }
}
