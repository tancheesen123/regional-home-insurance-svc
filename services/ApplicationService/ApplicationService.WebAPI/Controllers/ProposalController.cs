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

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> GetCustomerProposals([FromBody] GetCustomerProposalsRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.CustomerId))
                return BadRequest(new { message = "customerId is required." });

            try
            {
                var query  = new GetCustomerProposalsQuery { CustomerId = request.CustomerId };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetProposal([FromBody] GetProposalRequest request)
        {
            try
            {
                var query = new GetProposalQuery { Request = request, User = User };
                return Ok(await _mediator.Send(query));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateProposal([FromBody] CreateProposalRequest request)
        {
            try
            {
                var command = new CreateProposalCommand { Request = request, User = User };
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
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}
