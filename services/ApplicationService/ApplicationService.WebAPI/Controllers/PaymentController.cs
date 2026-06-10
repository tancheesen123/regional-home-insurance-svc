using ApplicationService.Core.Application.PaymentService.DTOs;
using ApplicationService.Core.Application.PaymentService.Features.Payment.Command;
using ApplicationService.Core.Application.PaymentService.Features.Payment.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ApplicationService.Core.Application.PaymentService.Settings;

namespace ApplicationService.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly StripeSettings _stripeSettings;

        public PaymentController(IMediator mediator, IOptions<StripeSettings> stripeOptions)
        {
            _mediator = mediator;
            _stripeSettings = stripeOptions.Value;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentRequest request)
        {
            var region = Request.Headers["X-Country-Code"].ToString().ToUpper();

            if (string.IsNullOrWhiteSpace(region))
                return BadRequest(new { message = "Missing X-Country-Code header. Valid values: PH, ID, KH." });

            try
            {
                var command = new InitiatePaymentCommand { Request = request, Region = region };
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
            catch (Stripe.StripeException ex)
            {
                return BadRequest(new { message = $"Stripe error: {ex.StripeError?.Message ?? ex.Message}" });
            }
        }

        [AllowAnonymous]
        [HttpGet("[action]")]
        public async Task<IActionResult> ConfirmPayment([FromQuery] string session_id)
        {
            if (string.IsNullOrWhiteSpace(session_id))
                return BadRequest(new { message = "Missing session_id query parameter." });

            try
            {
                var command = new ConfirmPaymentCommand { SessionId = session_id };
                var result  = await _mediator.Send(command);

                // Redirect the customer's browser to the frontend success page
                return Redirect(result.RedirectUrl);
            }
            catch (KeyNotFoundException ex)
            {
                // Redirect to frontend with error so the user sees a friendly message
                var errorUrl = $"{_stripeSettings.FrontendSuccessUrl}?error={Uri.EscapeDataString(ex.Message)}";
                return Redirect(errorUrl);
            }
            catch (InvalidOperationException ex)
            {
                var errorUrl = $"{_stripeSettings.FrontendSuccessUrl}?error={Uri.EscapeDataString(ex.Message)}";
                return Redirect(errorUrl);
            }
            catch (Exception ex)
            {
                var errorUrl = $"{_stripeSettings.FrontendSuccessUrl}?error={Uri.EscapeDataString("Payment confirmation failed. Please contact support.")}";
                return Redirect(errorUrl);
            }
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Callback()
        {
           
            string json;
            using (var reader = new StreamReader(HttpContext.Request.Body))
                json = await reader.ReadToEndAsync();

            var signature = Request.Headers["Stripe-Signature"].ToString();

            if (string.IsNullOrEmpty(signature))
                return BadRequest(new { message = "Missing Stripe-Signature header." });

            try
            {
                var command = new PaymentCallbackCommand { Json = json, StripeSignature = signature };
                return Ok(await _mediator.Send(command));
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Return 500 so Stripe retries the event — do not swallow silently
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> CancelPayment([FromQuery] string @ref)
        {
            if (string.IsNullOrWhiteSpace(@ref))
                return BadRequest(new { message = "Missing 'ref' query parameter." });

            try
            {
                var command = new CancelPaymentCommand { ReferenceNumber = @ref };
                return Ok(await _mediator.Send(command));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetPaymentsByProposal([FromBody] GetPaymentsByProposalRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ProposalId))
                return BadRequest(new { message = "proposalId is required." });

            try
            {
                var query = new GetPaymentsByProposalQuery { Request = request };
                return Ok(await _mediator.Send(query));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
