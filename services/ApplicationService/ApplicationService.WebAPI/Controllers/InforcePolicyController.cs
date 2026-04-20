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

        /// <summary>
        /// Inforce a proposal and issue a policy.
        ///
        /// Flow:
        ///   1. Validate ProposalId
        ///   2. Fetch proposal — throw if not found
        ///   3. Already inforced → return existing policy immediately
        ///   4. CheckPayment = false → agent/admin only bypass
        ///   5. CheckPayment = true → verify a SUCCESS payment exists
        ///   6. Confirm IsMainProposal = true
        ///   7. Generate policy number, inforce proposal, create policy
        ///   8. Trigger async backend processing (PDF, email/SMS)
        ///   9. Return policy details (+ download URL if WithUrlLink = true)
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IActionResult> InforcePolicy([FromBody] InforcePolicyRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ProposalId))
                return BadRequest(new { message = "ProposalId is required." });

            try
            {
                var command = new InforcePolicyCommand
                {
                    Request = request,
                    User    = User   // pass ClaimsPrincipal for role/bypass checks
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
