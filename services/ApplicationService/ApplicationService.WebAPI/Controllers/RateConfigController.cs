using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Features.Command;
using ApplicationService.Core.Application.RateConfigService.Features.Query;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.WebAPI.Controllers
{
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


        [HttpGet("configs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetConfigs()
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            var result = await _mediator.Send(new GetRateConfigsQuery { Region = Region });
            return Ok(result);
        }


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


        [HttpGet("snapshots")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSnapshots()
        {
            if (string.IsNullOrWhiteSpace(Region))
                return BadRequest(new { message = "X-Country-Code header is required (PH | ID | KH)." });

            var result = await _mediator.Send(new GetSnapshotsQuery { Region = Region });
            return Ok(result);
        }

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
