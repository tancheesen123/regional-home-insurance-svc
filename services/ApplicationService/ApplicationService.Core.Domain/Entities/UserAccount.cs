namespace ApplicationService.Core.Domain.Entities
{
    public class UserAccount
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public bool IsVerified { get; set; }

        // Navigation
        public Customer Customer { get; set; }
    }
}
