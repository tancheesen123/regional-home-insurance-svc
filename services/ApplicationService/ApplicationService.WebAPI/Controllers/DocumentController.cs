using ApplicationService.Core.Application.DocumentService.Features.Document.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DocumentController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DocumentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("PolicyDocumentStatus")]
        public async Task<IActionResult> PolicyDocumentStatus([FromQuery] string proposalId)
        {
            if (string.IsNullOrWhiteSpace(proposalId))
                return BadRequest(new { message = "proposalId is required." });

            try
            {
                var query  = new PolicyDocumentStatusQuery { ProposalId = proposalId, User = User };
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

        [HttpGet("DownloadFile")]
        public async Task<IActionResult> DownloadFile(
            [FromQuery] string proposalId,
            [FromQuery] string fileType)
        {
            if (string.IsNullOrWhiteSpace(proposalId))
                return BadRequest(new { message = "proposalId is required." });

            if (string.IsNullOrWhiteSpace(fileType))
                return BadRequest(new { message = "fileType is required. Accepted values: PDS, EPolicy, TaxInvoice." });

            try
            {
                var query  = new DownloadFileQuery { ProposalId = proposalId, FileType = fileType, User = User };
                var result = await _mediator.Send(query);

                return File(result.FileBytes, "application/pdf", result.FileName);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
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

        [HttpGet("DownloadPolicyDocuments")]
        public async Task<IActionResult> DownloadPolicyDocuments([FromQuery] string proposalId)
        {
            if (string.IsNullOrWhiteSpace(proposalId))
                return BadRequest(new { message = "proposalId is required." });

            try
            {
                var query  = new DownloadPolicyDocumentsQuery { ProposalId = proposalId, User = User };
                var result = await _mediator.Send(query);

                return File(result.ZipBytes, "application/zip", result.FileName);
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
