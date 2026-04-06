using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Core.Application.AuthService.DTOs
{
    public class CustomerGetAllResponse
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
