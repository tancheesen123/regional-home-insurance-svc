using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApplicationService.Core.Application.DTOs;

namespace ApplicationService.Core.Application.Interfaces
{
    public interface IQuotationServiceClient
    {
        Task<QuotationDto> GetQuotationAsync(Guid quotationId);
    }
}
