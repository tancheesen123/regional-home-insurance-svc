using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApplicationService.Core.Application.AuthService.DTOs;

namespace ApplicationService.Core.Application.AuthService.Interfaces
{
    public interface IQuotationServiceClient
    {
        Task<QuotationDto> GetQuotationAsync(Guid quotationId);
    }
}
