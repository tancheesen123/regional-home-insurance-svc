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

        /// <summary>
        /// Calculates the full premium breakdown for a given plan configuration.
        ///
        /// Steps performed (skipped: agent type resolution, commission, LPPSA subsidy):
        ///   1. Validate inputs (sum insured multiples, minimums)
        ///   3. Base gross premium from ProductPremiumRates table
        ///   4. Add-on premiums (LPPSA-exempt add-ons become free)
        ///   5. Discount (pass DiscountAmount in the request body)
        ///   6. End date = StartDate + 1 year - 1 day
        ///   8. Service tax
        ///   9. Stamp duty
        ///
        /// Requires header: X-Country-Code: PH | ID | KH
        /// </summary>
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
