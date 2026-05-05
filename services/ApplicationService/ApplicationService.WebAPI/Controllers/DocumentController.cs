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

        /// <summary>
        /// Polls whether all policy documents (PDS, ePolicy, Tax Invoice) have been generated.
        /// Returns isReady=false while generation is still in progress — safe to poll every few seconds.
        /// Only the authenticated customer who owns the proposal may call this endpoint.
        /// </summary>
        /// <param name="proposalId">The proposal ID returned during the inforce/payment flow.</param>
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

        /// <summary>
        /// Downloads a single policy PDF by file-type token.
        /// Accepted fileType values: "PDS" | "EPolicy" | "TaxInvoice"
        /// Only the authenticated customer who owns the proposal may call this endpoint.
        /// </summary>
        /// <param name="proposalId">The proposal ID returned during the inforce/payment flow.</param>
        /// <param name="fileType">One of: PDS, EPolicy, TaxInvoice (case-insensitive).</param>
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

        /// <summary>
        /// Downloads all policy documents (PDS, ePolicy, Tax Invoice) bundled into a single ZIP.
        /// Only the authenticated customer who owns the proposal may call this endpoint.
        /// </summary>
        /// <param name="proposalId">The proposal ID returned during the inforce/payment flow.</param>
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
