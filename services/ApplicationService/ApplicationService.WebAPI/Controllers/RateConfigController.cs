using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Features.Command;
using ApplicationService.Core.Application.RateConfigService.Features.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
    /// <summary>
    /// Rate configuration endpoints.
    ///
    /// Admin endpoints (require Role=Admin):
    ///   GET  /api/rateconfig/configs           — all raw config rows for the region
    ///   PUT  /api/rateconfig/building-rates/{id}
    ///   PUT  /api/rateconfig/region-config/{id}
    ///   PUT  /api/rateconfig/location-tiers/{id}
    ///   PUT  /api/rateconfig/risk-multipliers/{id}
    ///   POST /api/rateconfig/seed              — seed initial data for a region
    ///
    /// Public endpoint (any authenticated user / frontend):
    ///   GET  /api/rateconfig/building-config   — full config in frontend shape
    ///
    /// All endpoints require the X-Country-Code header: PH | ID | KH
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RateConfigController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RateConfigController(IMediator mediator) => _mediator = mediator;

        private string Region =>
            HttpContext.Request.Headers["X-Country-Code"].ToString().ToUpper();

        private string CallerName =>
            User.Identity?.Name ?? User.FindFirst("customerId")?.Value ?? "Admin";

        // ════════════════════════════════════════════════════════════════════════
        // PUBLIC — frontend fetches this to replace hardcoded BUILDING_CONFIGS
        // ════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Returns the full building-cost estimator config for the region in the shape
        /// the frontend expects (replaces the static BUILDING_CONFIGS object).
        /// </summary>
        [HttpGet("building-config")]
        public async Task<IActionResult> GetBuildingConfig()
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            try
            {
                var result = await _mediator.Send(new GetBuildingConfigQuery { Region = Region });
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ════════════════════════════════════════════════════════════════════════
        // ADMIN — read all raw config rows
        // ════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Returns all raw rate config rows for the region (for the admin dashboard table views).
        /// </summary>
        [HttpGet("configs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetConfigs()
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            var result = await _mediator.Send(new GetRateConfigsQuery { Region = Region });
            return Ok(result);
        }

        // ════════════════════════════════════════════════════════════════════════
        // ADMIN — update individual rows
        // ════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Updates one or more construction-rate rows in a single call.
        /// Pass an array of { id, ratePerUnit } — partial updates are supported
        /// (send only the rows you want to change).
        /// If any entry fails validation the entire batch is rejected; no changes are saved.
        /// </summary>
        [HttpPut("building-rates")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBuildingRates(
            [FromBody] UpdateBuildingRatesRequest body)
        {
            if (body?.Rates == null || body.Rates.Count == 0)
                return BadRequest(new { message = "At least one rate entry is required." });

            try
            {
                var result = await _mediator.Send(new UpdateBuildingRatesCommand
                {
                    Body      = body,
                    UpdatedBy = CallerName,
                });

                if (result.Errors.Count > 0)
                    return BadRequest(new { message = "Some entries failed.", errors = result.Errors });

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates the region-level config (area limits, storey rules, fees, benchmark year).
        /// All fields are optional — only provided fields are updated.
        /// </summary>
        [HttpPut("region-config/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRegionConfig(
            string id, [FromBody] UpdateRegionConfigRequest body)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest(new { message = "id is required." });

            try
            {
                var result = await _mediator.Send(new UpdateRegionConfigCommand
                {
                    Id        = id,
                    Body      = body,
                    UpdatedBy = CallerName,
                });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates a location-tier row (multiplier, display label, or province keyword list).
        /// All fields are optional — only provided fields are updated.
        /// Sending "keywords" replaces the entire keyword list for that tier.
        /// </summary>
        [HttpPut("location-tiers/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateLocationTier(
            string id, [FromBody] UpdateLocationTierRequest body)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest(new { message = "id is required." });

            try
            {
                var result = await _mediator.Send(new UpdateLocationTierCommand
                {
                    Id        = id,
                    Body      = body,
                    UpdatedBy = CallerName,
                });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates a risk multiplier value (e.g. flooding loading, partial-brick surcharge).
        /// Body: { "multiplier": 1.30, "description": "optional note" }
        /// </summary>
        [HttpPut("risk-multipliers/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRiskMultiplier(
            string id, [FromBody] UpdateRiskMultiplierRequest body)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest(new { message = "id is required." });

            try
            {
                var result = await _mediator.Send(new UpdateRiskMultiplierCommand
                {
                    Id        = id,
                    Body      = body,
                    UpdatedBy = CallerName,
                });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ════════════════════════════════════════════════════════════════════════
        // ADMIN — seed initial data
        // ════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Seeds the initial rate configuration for the region specified in X-Country-Code.
        /// Safe to call multiple times — returns a 200 with seeded=false if already seeded.
        /// Call once per region (PH, ID, KH) after first deployment.
        /// </summary>
        [HttpPost("seed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Seed()
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            try
            {
                var result = await _mediator.Send(new SeedRateConfigCommand { Region = Region });
                return Ok(new { seeded = result.Seeded, message = result.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
