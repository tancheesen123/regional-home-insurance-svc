using Microsoft.AspNetCore.Mvc;
using ApplicationService.Core.Application.Interfaces;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly IQuotationServiceClient _quotationClient;

        public ApplicationController(IQuotationServiceClient quotationClient)
        {
            _quotationClient = quotationClient;
        }

        [HttpGet("with-quotation/{quotationId}")]
        public async Task<IActionResult> GetWithQuotation(Guid quotationId)
        {
            // ✅ Calls QuotationService internally
            var quotation = await _quotationClient.GetQuotationAsync(quotationId);

            return Ok(new
            {
                ApplicationId = Guid.NewGuid(),
                Status = "Pending",
                Quotation = quotation  // ← data from QuotationService
            });
        }
    }
}