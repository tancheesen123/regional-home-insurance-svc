using ApplicationService.Core.Application.ProductService.DTOs;
using ApplicationService.Core.Application.ProductService.Features.Product.Command;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> CalculatePremium([FromBody] CalculatePremiumRequest request)
        {
            var region = Request.Headers["X-Country-Code"].ToString().ToUpper();

            if (string.IsNullOrWhiteSpace(region))
                return BadRequest(new { message = "Missing X-Country-Code header. Valid values: PH, ID, KH." });

            try
            {
                var command = new CalculatePremiumCommand { Request = request, Region = region };
                return Ok(await _mediator.Send(command));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
