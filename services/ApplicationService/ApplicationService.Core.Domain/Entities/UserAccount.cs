using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class UserAccount : TransactionBaseEntity
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public bool IsVerified { get; set; }

        public string Role { get; set; } = "User";

        public Customer Customer { get; set; }
    }
}
