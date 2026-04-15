using ApplicationService.Core.Application.ProposalService.DTOs;
using ApplicationService.Core.Application.ProposalService.Features.Proposal.Command;
using ApplicationService.Core.Application.ProposalService.Features.Proposal.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProposalController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProposalController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Step 5 — Retrieve full proposal details (personal info, addresses,
        /// quotation snapshot, plan, valuables and premium breakdown) for review
        /// before proceeding to payment.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IActionResult> GetProposal([FromBody] GetProposalRequest request)
        {
            try
            {
                var query = new GetProposalQuery { Request = request };
                return Ok(await _mediator.Send(query));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Step 4 — Create a formal proposal from a quoted/customised quotation.
        /// Locks the quotation so no further plan changes are allowed.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateProposal([FromBody] CreateProposalRequest request)
        {
            try
            {
                var command = new CreateProposalCommand { Request = request };
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
