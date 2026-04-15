using ApplicationService.Core.Application.QuotationService.DTOs;
using ApplicationService.Core.Application.QuotationService.Features.Quotation.Command;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public QuotationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetQuote([FromBody] GetQuoteRequest request)
        {
            try
            {
                var countryCode = Request.Headers["X-Country-Code"].ToString();
                var command = new GetQuoteCommand
                {
                    Request = request,
                    Region  = countryCode
                };
                return Ok(await _mediator.Send(command));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SubmitPolicy([FromBody] SubmitPolicyRequest request)
        {
            try
            {
                var command = new SubmitPolicyCommand { Request = request };
                return Ok(await _mediator.Send(command));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
