namespace ApplicationService.Core.Application.ProfileService.DTOs.Customer
{
    public class CustomerGetAllResponse
    {
        public List<CustomerDetail> Customers { get; set; } = new();
    }

    public class CustomerDetail
    {
        public string CustomerId { get; set; }
        public string Name { get; set; }
        public string IcNumber { get; set; }
        public string Address { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string Region { get; set; }
        public string UserId { get; set; }
    }
}
