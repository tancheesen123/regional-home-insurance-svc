using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class PolicyDocument : TransactionBaseEntity
    {
        public string DocumentId { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public DateTime UploadedAt { get; set; }
        public string FileType { get; set; }
        public string PolicyId { get; set; }

        // Navigation
        public Policy Policy { get; set; }
    }
}
