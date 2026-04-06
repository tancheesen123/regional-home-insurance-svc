using ApplicationService.Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Core.Application.AuthService.Interfaces.Services
{
    public interface ICustomerService
    {
        Task<Customer> GetAllCustomerAsync();
    }
}
