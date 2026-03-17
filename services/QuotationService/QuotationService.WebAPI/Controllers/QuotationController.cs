using Microsoft.AspNetCore.Mvc;
using QuotationService.Core.Application.DTOs;

namespace QuotationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotationController : ControllerBase
    {
        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            // Dummy data for now — replace with real DB later
            var quotation = new QuotationDto
            {
                Id = id,
                PolicyType = "Home Insurance",
                Premium = 1200.00m,
                CreatedAt = DateTime.UtcNow
            };

            return Ok(quotation);
        }
    }
}