using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Core.Domain.Entities
{
    public class ApplicationEntity
    {
        public Guid Id { get; set; }
        public string ApplicantName { get; set; }
        public string PolicyType { get; set; }
        public decimal Premium { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
