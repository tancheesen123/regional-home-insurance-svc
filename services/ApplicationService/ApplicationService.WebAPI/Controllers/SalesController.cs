using ApplicationService.Core.Application.SalesService.DTOs;
using ApplicationService.Core.Application.SalesService.Features.Command;
using ApplicationService.Core.Application.SalesService.Features.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SalesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SalesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetSalesRecords([FromBody] GetSalesRecordsRequest request)
        {
            try
            {
                var query  = new GetSalesRecordsQuery { Request = request };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ExportExcel([FromBody] GetSalesRecordsRequest request)
        {
            var region = HttpContext.Request.Headers["X-Country-Code"].ToString();

            try
            {
                var query  = new ExportSalesExcelQuery { Request = request, Region = region };
                var result = await _mediator.Send(query);

                if (result.FileBytes.Length == 0)
                    return NoContent();

                return File(
                    result.FileBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    result.FileName);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{recordId}")]
        public async Task<IActionResult> GetSalesRecordDetail(string recordId)
        {
            if (string.IsNullOrWhiteSpace(recordId))
                return BadRequest(new { message = "recordId is required." });

            try
            {
                var query  = new GetSalesRecordDetailQuery { RecordId = recordId };
                var result = await _mediator.Send(query);
                return Ok(result);
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

        [HttpPost("{recordId}/SendEmail")]
        public async Task<IActionResult> SendEmail(string recordId, [FromBody] SendSalesEmailRequest request)
        {
            if (string.IsNullOrWhiteSpace(recordId))
                return BadRequest(new { message = "recordId is required." });

            if (string.IsNullOrWhiteSpace(request?.To))
                return BadRequest(new { message = "'to' (recipient email) is required." });

            try
            {
                var command = new SendSalesEmailCommand
                {
                    RecordId = recordId,
                    ToEmail  = request.To.Trim(),
                };
                var result = await _mediator.Send(command);

                if (!result.Succeeded)
                    return UnprocessableEntity(new { succeeded = false, message = result.Message });

                return Ok(new { succeeded = true, message = result.Message });
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
