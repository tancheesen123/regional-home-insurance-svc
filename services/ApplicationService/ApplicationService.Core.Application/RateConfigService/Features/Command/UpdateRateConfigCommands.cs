using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Application.RateConfigService.Services;
using MediatR;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Command
{
    // ── Bulk-update building rates (embedded in RegionConfig.BuildingRatesJson) ──

    public class UpdateBuildingRatesCommand : IRequest<UpdateBuildingRatesResult>
    {
        public UpdateBuildingRatesRequest Body      { get; set; } = new();
        public string                     UpdatedBy { get; set; } = string.Empty;
        public string                     Region    { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateBuildingRatesCommand, UpdateBuildingRatesResult>
        {
            private readonly IRateConfigRepository _repo;
            private readonly RateConfigAuditService _audit;
            private static readonly JsonSerializerOptions _json =
                new() { PropertyNameCaseInsensitive = true };

            public Handler(IRateConfigRepository repo, RateConfigAuditService audit)
            {
                _repo  = repo;
                _audit = audit;
            }

            public async Task<UpdateBuildingRatesResult> Handle(
                UpdateBuildingRatesCommand cmd, CancellationToken ct)
            {
                if (cmd.Body.Rates == null || cmd.Body.Rates.Count == 0)
                    throw new ArgumentException("At least one rate entry is required.");

                var preChangeSnapshot = await _audit.CaptureSnapshotJsonAsync(cmd.Region);

                var regionConfig = await _repo.GetRegionConfigAsync(cmd.Region)
                    ?? throw new KeyNotFoundException($"RegionConfig for region '{cmd.Region}' not found.");

                // Deserialize current building rates JSON
                var rows = JsonSerializer.Deserialize<List<BuildingRateRow>>(
                    regionConfig.BuildingRatesJson ?? "[]", _json) ?? new();

                var updated = new List<BuildingRateDto>();
                var errors  = new List<string>();
                var logs    = new List<RateConfigChangeLogDto>();

                foreach (var item in cmd.Body.Rates)
                {
                    if (string.IsNullOrWhiteSpace(item.Id)) { errors.Add("An entry is missing its 'id'."); continue; }
                    if (item.RatePerUnit <= 0) { errors.Add($"Rate for id '{item.Id}' must be greater than zero."); continue; }

                    var row = rows.FirstOrDefault(r => r.Id == item.Id);
                    if (row == null) { errors.Add($"Building rate '{item.Id}' not found."); continue; }

                    if (row.RatePerUnit != item.RatePerUnit)
                        logs.Add(RateConfigAuditService.Log(
                            "BuildingConstructionRates", row.Id,
                            $"{row.PropertySubType} / {row.ConstructionType} → RatePerUnit",
                            row.RatePerUnit.ToString("F4"), item.RatePerUnit.ToString("F4")));

                    row.RatePerUnit = item.RatePerUnit;
                    updated.Add(new BuildingRateDto
                    {
                        Id = row.Id, Region = cmd.Region,
                        PropertySubType = row.PropertySubType, ConstructionType = row.ConstructionType,
                        RatePerUnit = row.RatePerUnit, IsActive = row.IsActive,
                    });
                }

                if (errors.Count > 0)
                    return new UpdateBuildingRatesResult { UpdatedCount = 0, Updated = new(), Errors = errors };

                // Serialize back and save
                regionConfig.BuildingRatesJson = JsonSerializer.Serialize(rows);
                regionConfig.UpdatedAt         = DateTime.UtcNow;
                regionConfig.UpdatedBy         = cmd.UpdatedBy;
                await _repo.UpdateRegionConfigAsync(regionConfig);
                await _repo.SaveChangesAsync();

                await _audit.RecordAsync(cmd.Region, cmd.UpdatedBy,
                    $"Building rates updated — {logs.Count} change(s)", "auto", logs, preChangeSnapshot);
                await _repo.SaveChangesAsync();

                return new UpdateBuildingRatesResult { UpdatedCount = updated.Count, Updated = updated, Errors = errors };
            }

            private class BuildingRateRow
            {
                public string  Id               { get; set; } = string.Empty;
                public string  PropertySubType  { get; set; } = string.Empty;
                public string  ConstructionType { get; set; } = string.Empty;
                public decimal RatePerUnit      { get; set; }
                public bool    IsActive         { get; set; } = true;
            }
        }
    }

    public class UpdateBuildingRatesResult
    {
        public int                   UpdatedCount { get; set; }
        public List<BuildingRateDto> Updated      { get; set; } = new();
        public List<string>          Errors       { get; set; } = new();
    }

    // ── Update RegionConfig (area / storey / fee settings) ────────────────────

    public class UpdateRegionConfigCommand : IRequest<RegionRateConfigDto>
    {
        public string                   Id        { get; set; } = string.Empty;
        public UpdateRegionConfigRequest Body      { get; set; } = new();
        public string                   UpdatedBy { get; set; } = string.Empty;
        public string                   Region    { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateRegionConfigCommand, RegionRateConfigDto>
        {
            private readonly IRateConfigRepository _repo;
            private readonly RateConfigAuditService _audit;
            public Handler(IRateConfigRepository repo, RateConfigAuditService audit)
            {
                _repo  = repo;
                _audit = audit;
            }

            public async Task<RegionRateConfigDto> Handle(
                UpdateRegionConfigCommand cmd, CancellationToken ct)
            {
                var preChangeSnapshot = await _audit.CaptureSnapshotJsonAsync(cmd.Region);

                var row = await _repo.GetRegionConfigByIdAsync(cmd.Id)
                    ?? throw new KeyNotFoundException($"RegionConfig '{cmd.Id}' not found.");

                var logs = new List<RateConfigChangeLogDto>();
                void Track(string field, string oldVal, string newVal)
                {
                    if (oldVal != newVal)
                        logs.Add(RateConfigAuditService.Log("RegionConfigs", row.Id, field, oldVal, newVal));
                }

                if (cmd.Body.AreaUnit            != null) { Track("AreaUnit",            row.AreaUnit,                          cmd.Body.AreaUnit);                                             row.AreaUnit            = cmd.Body.AreaUnit; }
                if (cmd.Body.AreaMin             != null) { Track("AreaMin",             row.AreaMin.ToString(),                cmd.Body.AreaMin.Value.ToString());                             row.AreaMin             = cmd.Body.AreaMin.Value; }
                if (cmd.Body.AreaMax             != null) { Track("AreaMax",             row.AreaMax.ToString(),                cmd.Body.AreaMax.Value.ToString());                             row.AreaMax             = cmd.Body.AreaMax.Value; }
                if (cmd.Body.StoreyIncrementPct  != null) { Track("StoreyIncrementPct",  row.StoreyIncrementPct.ToString("F4"), cmd.Body.StoreyIncrementPct.Value.ToString("F4"));             row.StoreyIncrementPct  = cmd.Body.StoreyIncrementPct.Value; }
                if (cmd.Body.MaxStoreys          != null) { Track("MaxStoreys",          row.MaxStoreys.ToString(),             cmd.Body.MaxStoreys.Value.ToString());                          row.MaxStoreys          = cmd.Body.MaxStoreys.Value; }
                if (cmd.Body.ProfessionalFeeRate != null) { Track("ProfessionalFeeRate", row.ProfessionalFeeRate.ToString("F4"),cmd.Body.ProfessionalFeeRate.Value.ToString("F4"));            row.ProfessionalFeeRate = cmd.Body.ProfessionalFeeRate.Value; }
                if (cmd.Body.BenchmarkYear       != null) { Track("BenchmarkYear",       row.BenchmarkYear.ToString(),          cmd.Body.BenchmarkYear.Value.ToString());                       row.BenchmarkYear       = cmd.Body.BenchmarkYear.Value; }

                row.UpdatedAt = DateTime.UtcNow;
                row.UpdatedBy = cmd.UpdatedBy;
                await _repo.UpdateRegionConfigAsync(row);
                await _repo.SaveChangesAsync();

                await _audit.RecordAsync(cmd.Region, cmd.UpdatedBy,
                    $"Region config updated — {logs.Count} change(s)", "auto", logs, preChangeSnapshot);
                await _repo.SaveChangesAsync();

                return new RegionRateConfigDto
                {
                    Id = row.Id, Region = row.Region, AreaUnit = row.AreaUnit,
                    AreaMin = row.AreaMin, AreaMax = row.AreaMax,
                    StoreyIncrementPct = row.StoreyIncrementPct, MaxStoreys = row.MaxStoreys,
                    ProfessionalFeeRate = row.ProfessionalFeeRate, BenchmarkYear = row.BenchmarkYear,
                    IsActive = row.IsActive,
                };
            }
        }
    }

    // ── Update single LocationTierConfig → RateMultiplierConfig ───────────────

    public class UpdateLocationTierCommand : IRequest<LocationTierDto>
    {
        public string                    Id        { get; set; } = string.Empty;
        public UpdateLocationTierRequest  Body      { get; set; } = new();
        public string                    UpdatedBy { get; set; } = string.Empty;
        public string                    Region    { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateLocationTierCommand, LocationTierDto>
        {
            private readonly IRateConfigRepository _repo;
            private readonly RateConfigAuditService _audit;
            public Handler(IRateConfigRepository repo, RateConfigAuditService audit)
            {
                _repo  = repo;
                _audit = audit;
            }

            public async Task<LocationTierDto> Handle(
                UpdateLocationTierCommand cmd, CancellationToken ct)
            {
                var preChangeSnapshot = await _audit.CaptureSnapshotJsonAsync(cmd.Region);

                var row = await _repo.GetMultiplierByIdAsync(cmd.Id)
                    ?? throw new KeyNotFoundException($"Location tier '{cmd.Id}' not found.");

                var logs = new List<RateConfigChangeLogDto>();
                void Track(string field, string old, string next)
                {
                    if (old != next)
                        logs.Add(RateConfigAuditService.Log("LocationTierConfigs", row.Id,
                            $"{row.FactorKey} → {field}", old, next));
                }

                if (cmd.Body.Multiplier != null) { Track("Multiplier", row.Multiplier.ToString("F4"), cmd.Body.Multiplier.Value.ToString("F4")); row.Multiplier = cmd.Body.Multiplier.Value; }
                if (cmd.Body.Label      != null) { Track("Label",      row.Label,                     cmd.Body.Label);                            row.Label      = cmd.Body.Label; }
                if (cmd.Body.Keywords   != null)
                {
                    var newJson = JsonSerializer.Serialize(cmd.Body.Keywords.Select(k => k.ToLower().Trim()).ToList());
                    Track("Keywords", row.KeywordsJson ?? "[]", newJson);
                    row.KeywordsJson = newJson;
                }

                row.UpdatedAt = DateTime.UtcNow;
                row.UpdatedBy = cmd.UpdatedBy;
                await _repo.UpdateMultiplierAsync(row);
                await _repo.SaveChangesAsync();

                await _audit.RecordAsync(cmd.Region, cmd.UpdatedBy,
                    $"Location tier '{row.FactorKey}' updated — {logs.Count} change(s)", "auto", logs, preChangeSnapshot);
                await _repo.SaveChangesAsync();

                return new LocationTierDto
                {
                    Id = row.Id, Region = row.Region, Tier = row.FactorKey,
                    Multiplier = row.Multiplier, Label = row.Label,
                    Keywords = DeserializeKeywords(row.KeywordsJson), IsActive = row.IsActive,
                };
            }

            private static List<string> DeserializeKeywords(string? json)
            {
                if (string.IsNullOrWhiteSpace(json)) return new();
                try { return JsonSerializer.Deserialize<List<string>>(json) ?? new(); }
                catch { return new(); }
            }
        }
    }

    // ── Bulk-update LocationTierConfig rows ───────────────────────────────────

    public class UpdateLocationTiersCommand : IRequest<UpdateLocationTiersResult>
    {
        public UpdateLocationTiersRequest Body      { get; set; } = new();
        public string                     UpdatedBy { get; set; } = string.Empty;
        public string                     Region    { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateLocationTiersCommand, UpdateLocationTiersResult>
        {
            private readonly IRateConfigRepository  _repo;
            private readonly RateConfigAuditService _audit;
            public Handler(IRateConfigRepository repo, RateConfigAuditService audit)
            {
                _repo  = repo;
                _audit = audit;
            }

            public async Task<UpdateLocationTiersResult> Handle(
                UpdateLocationTiersCommand cmd, CancellationToken ct)
            {
                if (cmd.Body.Tiers == null || cmd.Body.Tiers.Count == 0)
                    throw new ArgumentException("At least one tier entry is required.");

                var preChangeSnapshot = await _audit.CaptureSnapshotJsonAsync(cmd.Region);

                var updated = new List<LocationTierDto>();
                var errors  = new List<string>();
                var logs    = new List<RateConfigChangeLogDto>();

                foreach (var item in cmd.Body.Tiers)
                {
                    if (string.IsNullOrWhiteSpace(item.Id)) { errors.Add("An entry is missing its 'id'."); continue; }

                    var row = await _repo.GetMultiplierByIdAsync(item.Id);
                    if (row == null) { errors.Add($"Location tier '{item.Id}' not found."); continue; }

                    void Track(string field, string old, string next)
                    {
                        if (old != next)
                            logs.Add(RateConfigAuditService.Log("LocationTierConfigs", row.Id,
                                $"{row.FactorKey} → {field}", old, next));
                    }

                    if (item.Multiplier != null) { Track("Multiplier", row.Multiplier.ToString("F4"), item.Multiplier.Value.ToString("F4")); row.Multiplier = item.Multiplier.Value; }
                    if (item.Label      != null) { Track("Label",      row.Label,                     item.Label);                            row.Label      = item.Label; }
                    if (item.Keywords   != null)
                    {
                        var newJson = JsonSerializer.Serialize(item.Keywords.Select(k => k.ToLower().Trim()).ToList());
                        Track("Keywords", row.KeywordsJson ?? "[]", newJson);
                        row.KeywordsJson = newJson;
                    }

                    row.UpdatedAt = DateTime.UtcNow;
                    row.UpdatedBy = cmd.UpdatedBy;
                    await _repo.UpdateMultiplierAsync(row);

                    updated.Add(new LocationTierDto
                    {
                        Id = row.Id, Region = row.Region, Tier = row.FactorKey,
                        Multiplier = row.Multiplier, Label = row.Label,
                        Keywords = DeserializeKeywords(row.KeywordsJson), IsActive = row.IsActive,
                    });
                }

                if (errors.Count > 0)
                    return new UpdateLocationTiersResult { UpdatedCount = 0, Updated = new(), Errors = errors };

                await _repo.SaveChangesAsync();

                await _audit.RecordAsync(cmd.Region, cmd.UpdatedBy,
                    $"Location tiers updated — {logs.Count} change(s)", "auto", logs, preChangeSnapshot);
                await _repo.SaveChangesAsync();

                return new UpdateLocationTiersResult { UpdatedCount = updated.Count, Updated = updated, Errors = errors };
            }

            private static List<string> DeserializeKeywords(string? json)
            {
                if (string.IsNullOrWhiteSpace(json)) return new();
                try { return JsonSerializer.Deserialize<List<string>>(json) ?? new(); }
                catch { return new(); }
            }
        }
    }

    public class UpdateLocationTiersResult
    {
        public int                   UpdatedCount { get; set; }
        public List<LocationTierDto> Updated      { get; set; } = new();
        public List<string>          Errors       { get; set; } = new();
    }

    // ── Bulk-update RiskMultiplierConfig rows ─────────────────────────────────

    public class UpdateRiskMultipliersCommand : IRequest<UpdateRiskMultipliersResult>
    {
        public UpdateRiskMultipliersRequest Body      { get; set; } = new();
        public string                       UpdatedBy { get; set; } = string.Empty;
        public string                       Region    { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateRiskMultipliersCommand, UpdateRiskMultipliersResult>
        {
            private readonly IRateConfigRepository  _repo;
            private readonly RateConfigAuditService _audit;
            public Handler(IRateConfigRepository repo, RateConfigAuditService audit)
            {
                _repo  = repo;
                _audit = audit;
            }

            public async Task<UpdateRiskMultipliersResult> Handle(
                UpdateRiskMultipliersCommand cmd, CancellationToken ct)
            {
                if (cmd.Body.Multipliers == null || cmd.Body.Multipliers.Count == 0)
                    throw new ArgumentException("At least one multiplier entry is required.");

                var preChangeSnapshot = await _audit.CaptureSnapshotJsonAsync(cmd.Region);

                var updated = new List<RiskMultiplierDto>();
                var errors  = new List<string>();
                var logs    = new List<RateConfigChangeLogDto>();

                foreach (var item in cmd.Body.Multipliers)
                {
                    if (string.IsNullOrWhiteSpace(item.Id))  { errors.Add("An entry is missing its 'id'."); continue; }
                    if (item.Multiplier <= 0)                  { errors.Add($"Multiplier for id '{item.Id}' must be greater than zero."); continue; }

                    var row = await _repo.GetMultiplierByIdAsync(item.Id);
                    if (row == null) { errors.Add($"Risk multiplier '{item.Id}' not found."); continue; }

                    if (row.Multiplier != item.Multiplier)
                        logs.Add(RateConfigAuditService.Log("RiskMultiplierConfigs", row.Id,
                            $"{row.FactorKey} → Multiplier",
                            row.Multiplier.ToString("F4"), item.Multiplier.ToString("F4")));

                    row.Multiplier  = item.Multiplier;
                    if (item.Description != null) row.Description = item.Description;
                    row.UpdatedAt   = DateTime.UtcNow;
                    row.UpdatedBy   = cmd.UpdatedBy;
                    await _repo.UpdateMultiplierAsync(row);

                    updated.Add(new RiskMultiplierDto
                    {
                        Id = row.Id, Region = row.Region, FactorKey = row.FactorKey,
                        Multiplier = row.Multiplier, Description = row.Description, IsActive = row.IsActive,
                    });
                }

                if (errors.Count > 0)
                    return new UpdateRiskMultipliersResult { UpdatedCount = 0, Updated = new(), Errors = errors };

                await _repo.SaveChangesAsync();

                await _audit.RecordAsync(cmd.Region, cmd.UpdatedBy,
                    $"Risk multipliers updated — {logs.Count} change(s)", "auto", logs, preChangeSnapshot);
                await _repo.SaveChangesAsync();

                return new UpdateRiskMultipliersResult { UpdatedCount = updated.Count, Updated = updated, Errors = errors };
            }
        }
    }

    public class UpdateRiskMultipliersResult
    {
        public int                    UpdatedCount { get; set; }
        public List<RiskMultiplierDto> Updated     { get; set; } = new();
        public List<string>            Errors      { get; set; } = new();
    }

    // ── Update single RiskMultiplierConfig ────────────────────────────────────

    public class UpdateRiskMultiplierCommand : IRequest<RiskMultiplierDto>
    {
        public string                      Id        { get; set; } = string.Empty;
        public UpdateRiskMultiplierRequest  Body      { get; set; } = new();
        public string                      UpdatedBy { get; set; } = string.Empty;
        public string                      Region    { get; set; } = string.Empty;

        public class Handler : IRequestHandler<UpdateRiskMultiplierCommand, RiskMultiplierDto>
        {
            private readonly IRateConfigRepository _repo;
            private readonly RateConfigAuditService _audit;
            public Handler(IRateConfigRepository repo, RateConfigAuditService audit)
            {
                _repo  = repo;
                _audit = audit;
            }

            public async Task<RiskMultiplierDto> Handle(
                UpdateRiskMultiplierCommand cmd, CancellationToken ct)
            {
                var preChangeSnapshot = await _audit.CaptureSnapshotJsonAsync(cmd.Region);

                var row = await _repo.GetMultiplierByIdAsync(cmd.Id)
                    ?? throw new KeyNotFoundException($"Risk multiplier '{cmd.Id}' not found.");

                if (cmd.Body.Multiplier <= 0)
                    throw new ArgumentException("Multiplier must be greater than zero.");

                var logs = new List<RateConfigChangeLogDto>();
                if (row.Multiplier != cmd.Body.Multiplier)
                    logs.Add(RateConfigAuditService.Log("RiskMultiplierConfigs", row.Id,
                        $"{row.FactorKey} → Multiplier",
                        row.Multiplier.ToString("F4"), cmd.Body.Multiplier.ToString("F4")));

                row.Multiplier  = cmd.Body.Multiplier;
                if (cmd.Body.Description != null) row.Description = cmd.Body.Description;
                row.UpdatedAt   = DateTime.UtcNow;
                row.UpdatedBy   = cmd.UpdatedBy;
                await _repo.UpdateMultiplierAsync(row);
                await _repo.SaveChangesAsync();

                await _audit.RecordAsync(cmd.Region, cmd.UpdatedBy,
                    $"Risk multiplier '{row.FactorKey}' updated", "auto", logs, preChangeSnapshot);
                await _repo.SaveChangesAsync();

                return new RiskMultiplierDto
                {
                    Id = row.Id, Region = row.Region, FactorKey = row.FactorKey,
                    Multiplier = row.Multiplier, Description = row.Description, IsActive = row.IsActive,
                };
            }
        }
    }
}
