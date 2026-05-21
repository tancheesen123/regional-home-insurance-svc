using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using MediatR;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Command
{
    // ── Bulk-update one or more BuildingConstructionRate rows ────────────────────

    public class UpdateBuildingRatesCommand : IRequest<UpdateBuildingRatesResult>
    {
        public UpdateBuildingRatesRequest Body      { get; set; } = new();
        public string                     UpdatedBy { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateBuildingRatesCommand, UpdateBuildingRatesResult>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<UpdateBuildingRatesResult> Handle(
                UpdateBuildingRatesCommand cmd, CancellationToken ct)
            {
                if (cmd.Body.Rates == null || cmd.Body.Rates.Count == 0)
                    throw new ArgumentException("At least one rate entry is required.");

                var updated = new List<BuildingRateDto>();
                var errors  = new List<string>();

                foreach (var item in cmd.Body.Rates)
                {
                    if (string.IsNullOrWhiteSpace(item.Id))
                    {
                        errors.Add("An entry is missing its 'id'.");
                        continue;
                    }
                    if (item.RatePerUnit <= 0)
                    {
                        errors.Add($"Rate for id '{item.Id}' must be greater than zero.");
                        continue;
                    }

                    var row = await _repo.GetBuildingRateByIdAsync(item.Id);
                    if (row == null)
                    {
                        errors.Add($"BuildingConstructionRate '{item.Id}' not found.");
                        continue;
                    }

                    row.RatePerUnit = item.RatePerUnit;
                    row.UpdatedAt   = DateTime.UtcNow;
                    row.UpdatedBy   = cmd.UpdatedBy;

                    await _repo.UpdateBuildingRateAsync(row);

                    updated.Add(new BuildingRateDto
                    {
                        Id               = row.Id,
                        Region           = row.Region,
                        PropertySubType  = row.PropertySubType,
                        ConstructionType = row.ConstructionType,
                        RatePerUnit      = row.RatePerUnit,
                        IsActive         = row.IsActive,
                    });
                }

                if (errors.Count == 0)
                    await _repo.SaveChangesAsync();

                return new UpdateBuildingRatesResult
                {
                    UpdatedCount = updated.Count,
                    Updated      = updated,
                    Errors       = errors,
                };
            }
        }
    }

    public class UpdateBuildingRatesResult
    {
        public int                 UpdatedCount { get; set; }
        public List<BuildingRateDto> Updated   { get; set; } = new();
        public List<string>          Errors    { get; set; } = new();
    }

    // ── Update RegionRateConfig ────────────────────────────────────────────────

    public class UpdateRegionConfigCommand : IRequest<RegionRateConfigDto>
    {
        public string                    Id        { get; set; } = string.Empty;
        public UpdateRegionConfigRequest  Body      { get; set; } = new();
        public string                    UpdatedBy { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateRegionConfigCommand, RegionRateConfigDto>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<RegionRateConfigDto> Handle(
                UpdateRegionConfigCommand cmd, CancellationToken ct)
            {
                var row = await _repo.GetRegionConfigByIdAsync(cmd.Id)
                    ?? throw new KeyNotFoundException($"RegionRateConfig '{cmd.Id}' not found.");

                // Apply only the fields that were provided
                if (cmd.Body.AreaUnit            != null) row.AreaUnit            = cmd.Body.AreaUnit;
                if (cmd.Body.AreaMin             != null) row.AreaMin             = cmd.Body.AreaMin.Value;
                if (cmd.Body.AreaMax             != null) row.AreaMax             = cmd.Body.AreaMax.Value;
                if (cmd.Body.StoreyIncrementPct  != null) row.StoreyIncrementPct  = cmd.Body.StoreyIncrementPct.Value;
                if (cmd.Body.MaxStoreys          != null) row.MaxStoreys          = cmd.Body.MaxStoreys.Value;
                if (cmd.Body.ProfessionalFeeRate != null) row.ProfessionalFeeRate = cmd.Body.ProfessionalFeeRate.Value;
                if (cmd.Body.BenchmarkYear       != null) row.BenchmarkYear       = cmd.Body.BenchmarkYear.Value;

                row.UpdatedAt = DateTime.UtcNow;
                row.UpdatedBy = cmd.UpdatedBy;

                await _repo.UpdateRegionConfigAsync(row);
                await _repo.SaveChangesAsync();

                return new RegionRateConfigDto
                {
                    Id                  = row.Id,
                    Region              = row.Region,
                    AreaUnit            = row.AreaUnit,
                    AreaMin             = row.AreaMin,
                    AreaMax             = row.AreaMax,
                    StoreyIncrementPct  = row.StoreyIncrementPct,
                    MaxStoreys          = row.MaxStoreys,
                    ProfessionalFeeRate = row.ProfessionalFeeRate,
                    BenchmarkYear       = row.BenchmarkYear,
                    IsActive            = row.IsActive,
                };
            }
        }
    }

    // ── Update a LocationTierConfig row ───────────────────────────────────────

    public class UpdateLocationTierCommand : IRequest<LocationTierDto>
    {
        public string                     Id        { get; set; } = string.Empty;
        public UpdateLocationTierRequest   Body      { get; set; } = new();
        public string                     UpdatedBy { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateLocationTierCommand, LocationTierDto>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<LocationTierDto> Handle(
                UpdateLocationTierCommand cmd, CancellationToken ct)
            {
                var row = await _repo.GetLocationTierByIdAsync(cmd.Id)
                    ?? throw new KeyNotFoundException($"LocationTierConfig '{cmd.Id}' not found.");

                if (cmd.Body.Multiplier != null) row.Multiplier = cmd.Body.Multiplier.Value;
                if (cmd.Body.Label      != null) row.Label      = cmd.Body.Label;
                if (cmd.Body.Keywords   != null)
                    row.KeywordsJson = JsonSerializer.Serialize(
                        cmd.Body.Keywords.Select(k => k.ToLower().Trim()).ToList());

                row.UpdatedAt = DateTime.UtcNow;
                row.UpdatedBy = cmd.UpdatedBy;

                await _repo.UpdateLocationTierAsync(row);
                await _repo.SaveChangesAsync();

                return new LocationTierDto
                {
                    Id         = row.Id,
                    Region     = row.Region,
                    Tier       = row.Tier,
                    Multiplier = row.Multiplier,
                    Label      = row.Label,
                    Keywords   = DeserializeKeywords(row.KeywordsJson),
                    IsActive   = row.IsActive,
                };
            }

            private static List<string> DeserializeKeywords(string json)
            {
                try { return JsonSerializer.Deserialize<List<string>>(json) ?? new(); }
                catch { return new(); }
            }
        }
    }

    // ── Update a RiskMultiplierConfig row ─────────────────────────────────────

    public class UpdateRiskMultiplierCommand : IRequest<RiskMultiplierDto>
    {
        public string                        Id        { get; set; } = string.Empty;
        public UpdateRiskMultiplierRequest    Body      { get; set; } = new();
        public string                        UpdatedBy { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateRiskMultiplierCommand, RiskMultiplierDto>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<RiskMultiplierDto> Handle(
                UpdateRiskMultiplierCommand cmd, CancellationToken ct)
            {
                var row = await _repo.GetRiskMultiplierByIdAsync(cmd.Id)
                    ?? throw new KeyNotFoundException($"RiskMultiplierConfig '{cmd.Id}' not found.");

                if (cmd.Body.Multiplier <= 0)
                    throw new ArgumentException("Multiplier must be greater than zero.");

                row.Multiplier  = cmd.Body.Multiplier;
                if (cmd.Body.Description != null) row.Description = cmd.Body.Description;
                row.UpdatedAt   = DateTime.UtcNow;
                row.UpdatedBy   = cmd.UpdatedBy;

                await _repo.UpdateRiskMultiplierAsync(row);
                await _repo.SaveChangesAsync();

                return new RiskMultiplierDto
                {
                    Id          = row.Id,
                    Region      = row.Region,
                    FactorKey   = row.FactorKey,
                    Multiplier  = row.Multiplier,
                    Description = row.Description,
                    IsActive    = row.IsActive,
                };
            }
        }
    }
}
