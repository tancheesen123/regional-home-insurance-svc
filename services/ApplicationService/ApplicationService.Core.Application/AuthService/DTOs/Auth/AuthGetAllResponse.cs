using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Core.Application.AuthService.DTOs.Auth
{
    public class AuthGetAllResponse
    {
        public List<AuthDetail> Auths { get; set; } = new();
    }

    public class AuthDetail
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public string IsVerified { get; set; }
    }
}
