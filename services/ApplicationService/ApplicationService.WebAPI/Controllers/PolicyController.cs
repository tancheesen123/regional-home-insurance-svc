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

        /// <summary>
        /// Returns a summary list of all inforced policies belonging to the authenticated customer.
        /// </summary>
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

        /// <summary>
        /// Returns full details of a single inforced policy — including its document list —
        /// for the authenticated customer who owns the proposal.
        /// To download a document call GET /api/document/DownloadFile?proposalId=&amp;fileType=
        /// </summary>
        /// <param name="proposalId">The proposal ID associated with the policy.</param>
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
