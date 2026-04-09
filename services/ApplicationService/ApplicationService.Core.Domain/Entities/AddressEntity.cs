using ApplicationService.Core.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace ApplicationService.Core.Domain.Entities
{
    public class AddressEntity : TransactionBaseEntity
    {
        [MaxLength(100)]
        public string? AddressLine1 { get; set; }
        [MaxLength(100)]
        public string? AddressLine2 { get; set; }
        [MaxLength(100)]
        public string? City { get; set; }
        [MaxLength(10)]
        public string? Postcode { get; set; }
        [MaxLength(100)]
        public string? State { get; set; }

        // Navigation
        public Customer? Customer { get; set; }
    }
}
