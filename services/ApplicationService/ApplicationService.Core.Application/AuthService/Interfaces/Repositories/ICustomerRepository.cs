using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApplicationService.Core.Domain.Entities;


namespace ApplicationService.Core.Application.AuthService.Interfaces.Repositories
{
    public interface ICustomerRepository
    {
        Task<List<Customer>> GetAllAsync();
        //Task SaveChangesAsync();
    }
}
