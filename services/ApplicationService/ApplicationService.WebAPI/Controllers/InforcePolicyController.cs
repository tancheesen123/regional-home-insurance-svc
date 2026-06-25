using ApplicationService.Core.Application.InforcePolicyService.DTOs;
using ApplicationService.Core.Application.InforcePolicyService.Features.InforcePolicy.Command;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InforcePolicyController : ControllerBase
    {
        private readonly IMediator _mediator;

        public InforcePolicyController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> InforcePolicy([FromBody] InforcePolicyRequest request)
        {
            var region = Request.Headers["X-Country-Code"].ToString().ToUpper();
            if (string.IsNullOrWhiteSpace(region))
                return BadRequest(new { message = "Missing X-Country-Code header. Valid values: PH, ID, KH." });

            if (string.IsNullOrWhiteSpace(request.ProposalId))
                return BadRequest(new { message = "ProposalId is required." });

            try
            {
                var command = new InforcePolicyCommand
                {
                    Request = request,
                    User    = User
                };

                return Ok(await _mediator.Send(command));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
