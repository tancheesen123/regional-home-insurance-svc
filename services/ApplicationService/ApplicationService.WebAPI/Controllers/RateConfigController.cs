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
    ///   GET  /api/rateconfig/configs                    — all raw config rows for the region
    ///   PUT  /api/rateconfig/building-rates             — bulk update building-rate rows
    ///   PUT  /api/rateconfig/region-config/{id}        — update region-level config
    ///   PUT  /api/rateconfig/location-tiers            — bulk update location-tier rows
    ///   PUT  /api/rateconfig/location-tiers/{id}       — update a single location-tier row
    ///   PUT  /api/rateconfig/risk-multipliers          — bulk update risk-multiplier rows
    ///   PUT  /api/rateconfig/risk-multipliers/{id}     — update a single risk-multiplier row
    ///   POST /api/rateconfig/seed                      — seed initial data for a region
    ///   GET  /api/rateconfig/snapshots                 — list config snapshots (newest first)
    ///   GET  /api/rateconfig/snapshots/{snapshotId}    — single snapshot with change-log detail
    ///   GET  /api/rateconfig/change-logs               — paginated field-level change log
    ///   POST /api/rateconfig/restore/{snapshotId}      — roll back to a previous snapshot
    ///
    /// Public endpoint (any authenticated user / frontend):
    ///   GET  /api/rateconfig/building-config           — full config in frontend shape
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
        // PUBLIC — building cost estimator (standalone calculator page)
        // ════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Calculates a recommended Building Sum Insured from the customer's floor area,
        /// property type, construction type, storey count, province, and optional add-on costs.
        ///
        /// Formula (in order):
        ///   1. constructionCost     = FloorArea × BaseRatePerUnit
        ///   2. storeyLoading        = constructionCost × (NumberOfStoreys − 1) × StoreyIncrementPct
        ///      storeyAdjusted       = constructionCost + storeyLoading
        ///   3. locationAdjusted     = storeyAdjusted × LocationMultiplier   (auto-detected from Province)
        ///   4. professionalFee      = locationAdjusted × ProfessionalFeeRate
        ///   5. TotalRebuildingCost  = locationAdjusted + professionalFee + AdditionalCost
        ///
        /// Province is matched case-insensitively against stored location-tier keywords.
        /// Unrecognised provinces default to the "urban" tier (multiplier = 1.00).
        /// </summary>
        [HttpPost("calculate-building-cost")]
        public async Task<IActionResult> CalculateBuildingCost(
            [FromBody] BuildingCostRequest body)
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            if (body == null)
                return BadRequest(new { message = "Request body is required." });

            try
            {
                var result = await _mediator.Send(new CalculateBuildingCostQuery
                {
                    Region = Region,
                    Body   = body,
                });
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return UnprocessableEntity(new { message = ex.Message });
            }
        }

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
        // ADMIN — update individual config rows
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
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            if (body?.Rates == null || body.Rates.Count == 0)
                return BadRequest(new { message = "At least one rate entry is required." });

            try
            {
                var result = await _mediator.Send(new UpdateBuildingRatesCommand
                {
                    Body      = body,
                    UpdatedBy = CallerName,
                    Region    = Region,
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

            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            try
            {
                var result = await _mediator.Send(new UpdateRegionConfigCommand
                {
                    Id        = id,
                    Body      = body,
                    UpdatedBy = CallerName,
                    Region    = Region,
                });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Bulk-updates one or more location-tier rows in a single call.
        /// Pass an array of { id, multiplier?, label?, keywords? } — only provided fields are updated.
        /// Sending "keywords" replaces the entire keyword list for that tier.
        /// If any entry fails validation the entire batch is rejected; no changes are saved.
        /// </summary>
        [HttpPut("location-tiers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateLocationTiers(
            [FromBody] UpdateLocationTiersRequest body)
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            if (body?.Tiers == null || body.Tiers.Count == 0)
                return BadRequest(new { message = "At least one tier entry is required." });

            try
            {
                var result = await _mediator.Send(new UpdateLocationTiersCommand
                {
                    Body      = body,
                    UpdatedBy = CallerName,
                    Region    = Region,
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
        /// Updates a single location-tier row (multiplier, display label, or province keyword list).
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

            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            try
            {
                var result = await _mediator.Send(new UpdateLocationTierCommand
                {
                    Id        = id,
                    Body      = body,
                    UpdatedBy = CallerName,
                    Region    = Region,
                });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Bulk-updates one or more risk multiplier rows in a single call.
        /// Pass an array of { id, multiplier, description? }.
        /// If any entry fails validation the entire batch is rejected; no changes are saved.
        /// </summary>
        [HttpPut("risk-multipliers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRiskMultipliers(
            [FromBody] UpdateRiskMultipliersRequest body)
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            if (body?.Multipliers == null || body.Multipliers.Count == 0)
                return BadRequest(new { message = "At least one multiplier entry is required." });

            try
            {
                var result = await _mediator.Send(new UpdateRiskMultipliersCommand
                {
                    Body      = body,
                    UpdatedBy = CallerName,
                    Region    = Region,
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
        /// Updates a single risk multiplier value (e.g. flooding loading, partial-brick surcharge).
        /// Body: { "multiplier": 1.30, "description": "optional note" }
        /// </summary>
        [HttpPut("risk-multipliers/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRiskMultiplier(
            string id, [FromBody] UpdateRiskMultiplierRequest body)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest(new { message = "id is required." });

            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            try
            {
                var result = await _mediator.Send(new UpdateRiskMultiplierCommand
                {
                    Id        = id,
                    Body      = body,
                    UpdatedBy = CallerName,
                    Region    = Region,
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

        /// <summary>
        /// Inserts any missing RiskMultiplierConfig rows for the region without touching existing data.
        /// Safe to call multiple times — skips keys that already exist.
        /// Use this after deploying a backend update that added new multiplier keys
        /// (e.g. age.*, quality.*, topography.*, site.*) to already-seeded regions.
        /// </summary>
        [HttpPost("patch-seed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PatchSeed()
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            try
            {
                var result = await _mediator.Send(
                    new PatchSeedRiskMultipliersCommand { Region = Region });
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ════════════════════════════════════════════════════════════════════════
        // ADMIN — snapshot & change-log audit
        // ════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Returns all config snapshots for the region, newest first.
        /// Each snapshot records the full region config at the moment of a save.
        /// Use GET /snapshots/{snapshotId} to see the field-level change log for a specific save.
        /// </summary>
        [HttpGet("snapshots")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSnapshots()
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            var result = await _mediator.Send(new GetSnapshotsQuery { Region = Region });
            return Ok(result);
        }

        /// <summary>
        /// Returns a single snapshot with the full field-level change log attached.
        /// The snapshotJson field contains the complete region config as it was at save time.
        /// </summary>
        [HttpGet("snapshots/{snapshotId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSnapshotById(string snapshotId)
        {
            try
            {
                var result = await _mediator.Send(
                    new GetSnapshotByIdQuery { SnapshotId = snapshotId });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Returns a paginated list of every individual field change for the region,
        /// newest first. Each row shows which table/record/field changed and the old vs new value.
        /// Query params: page (default 1), pageSize (default 50, max 200).
        /// </summary>
        [HttpGet("change-logs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetChangeLogs(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            var result = await _mediator.Send(new GetChangeLogsQuery
            {
                Region   = Region,
                Page     = page,
                PageSize = pageSize,
            });
            return Ok(result);
        }

        /// <summary>
        /// Restores every rate config table for the region to the values stored in the
        /// specified snapshot. A new "restored" audit snapshot is created automatically.
        /// Body: { "note": "optional comment" }
        /// </summary>
        [HttpPost("restore/{snapshotId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RestoreSnapshot(
            string snapshotId, [FromBody] RestoreSnapshotRequest? body)
        {
            if (string.IsNullOrWhiteSpace(snapshotId))
                return BadRequest(new { message = "snapshotId is required." });

            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            try
            {
                var result = await _mediator.Send(new RestoreSnapshotCommand
                {
                    SnapshotId = snapshotId,
                    RestoredBy = CallerName,
                    Region     = Region,
                    Note       = body?.Note,
                });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return UnprocessableEntity(new { message = ex.Message });
            }
        }
    }
}
