using ApplicationService.Core.Application.ProposalService.Features.Policy.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PolicyController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PolicyController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetPolicies()
        {
            try
            {
                var query  = new GetPoliciesQuery { User = User };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpGet("{proposalId}")]
        public async Task<IActionResult> GetPolicy(string proposalId)
        {
            if (string.IsNullOrWhiteSpace(proposalId))
                return BadRequest(new { message = "proposalId is required." });

            try
            {
                var query  = new GetPolicyQuery { ProposalId = proposalId, User = User };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
