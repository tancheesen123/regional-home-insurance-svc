using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Core.Application.AuthService.DTOs
{
    // Mirror of QuotationService response
    public class QuotationDto
    {
        public Guid Id { get; set; }
        public string PolicyType { get; set; }
        public decimal Premium { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
