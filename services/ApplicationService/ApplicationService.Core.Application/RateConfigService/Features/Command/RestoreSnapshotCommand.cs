using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Application.RateConfigService.Services;
using MediatR;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Command
{
    public class RestoreSnapshotCommand : IRequest<RestoreSnapshotResult>
    {
        public string  SnapshotId  { get; set; } = string.Empty;
        public string  RestoredBy  { get; set; } = string.Empty;
        public string  Region      { get; set; } = string.Empty;
        public string? Note        { get; set; }

        public class Handler : IRequestHandler<RestoreSnapshotCommand, RestoreSnapshotResult>
        {
            private readonly IRateConfigRepository  _repo;
            private readonly RateConfigAuditService _audit;
            private static readonly JsonSerializerOptions _json =
                new() { PropertyNameCaseInsensitive = true };

            public Handler(IRateConfigRepository repo, RateConfigAuditService audit)
            {
                _repo  = repo;
                _audit = audit;
            }

            public async Task<RestoreSnapshotResult> Handle(
                RestoreSnapshotCommand cmd, CancellationToken ct)
            {
                var snapshot = await _repo.GetSnapshotByIdAsync(cmd.SnapshotId)
                    ?? throw new KeyNotFoundException($"Snapshot '{cmd.SnapshotId}' not found.");

                SnapshotPayload payload;
                try
                {
                    payload = JsonSerializer.Deserialize<SnapshotPayload>(snapshot.SnapshotJson, _json)
                        ?? throw new InvalidOperationException("Snapshot JSON is empty.");
                }
                catch (JsonException ex)
                {
                    throw new InvalidOperationException($"Snapshot JSON could not be parsed: {ex.Message}");
                }

                var region = cmd.Region.ToUpper();
                var logs   = new List<RateConfigChangeLogDto>();

                var regionRow = await _repo.GetRegionConfigAsync(region);
                if (regionRow != null)
                {
                    void TrackR(string field, string oldV, string newV)
                    {
                        if (oldV != newV) logs.Add(RateConfigAuditService.Log("RegionConfigs", regionRow.Id, field, oldV, newV));
                    }

                    TrackR("AreaUnit",           regionRow.AreaUnit,                          payload.AreaUnit ?? regionRow.AreaUnit);
                    TrackR("AreaMin",             regionRow.AreaMin.ToString(),                payload.AreaMin.ToString());
                    TrackR("AreaMax",             regionRow.AreaMax.ToString(),                payload.AreaMax.ToString());
                    TrackR("StoreyIncrementPct",  regionRow.StoreyIncrementPct.ToString("F4"), payload.StoreyIncrementPct.ToString("F4"));
                    TrackR("MaxStoreys",          regionRow.MaxStoreys.ToString(),             payload.MaxStoreys.ToString());
                    TrackR("ProfessionalFeeRate", regionRow.ProfessionalFeeRate.ToString("F4"),payload.ProfessionalFeeRate.ToString("F4"));
                    TrackR("BenchmarkYear",       regionRow.BenchmarkYear.ToString(),          payload.BenchmarkYear.ToString());

                    regionRow.AreaUnit            = payload.AreaUnit ?? regionRow.AreaUnit;
                    regionRow.AreaMin             = payload.AreaMin;
                    regionRow.AreaMax             = payload.AreaMax;
                    regionRow.StoreyIncrementPct  = payload.StoreyIncrementPct;
                    regionRow.MaxStoreys          = payload.MaxStoreys;
                    regionRow.ProfessionalFeeRate = payload.ProfessionalFeeRate;
                    regionRow.BenchmarkYear       = payload.BenchmarkYear;

                    if (!string.IsNullOrWhiteSpace(payload.BuildingRatesJson))
                    {
                        TrackR("BuildingRatesJson", regionRow.BuildingRatesJson, payload.BuildingRatesJson);
                        regionRow.BuildingRatesJson = payload.BuildingRatesJson;
                    }

                    regionRow.UpdatedAt = DateTime.UtcNow;
                    regionRow.UpdatedBy = cmd.RestoredBy;
                    await _repo.UpdateRegionConfigAsync(regionRow);
                }

                if (payload.LocationTiers != null)
                {
                    var tierRows = await _repo.GetMultipliersAsync(region, "location_tier");
                    foreach (var row in tierRows)
                    {
                        var key = row.FactorKey.ToLower();
                        if (!payload.LocationTiers.TryGetValue(key, out var tierDetail)) continue;

                        var newKeywordsJson = JsonSerializer.Serialize(tierDetail.Keywords ?? new List<string>());

                        void TrackT(string field, string oldV, string newV)
                        {
                            if (oldV != newV) logs.Add(RateConfigAuditService.Log("LocationTierConfigs", row.Id, $"{row.FactorKey} → {field}", oldV, newV));
                        }

                        TrackT("Multiplier", row.Multiplier.ToString("F4"), tierDetail.Multiplier.ToString("F4"));
                        TrackT("Label",      row.Label,                     tierDetail.Label ?? row.Label);
                        TrackT("Keywords",   row.KeywordsJson ?? "[]",       newKeywordsJson);

                        row.Multiplier   = tierDetail.Multiplier;
                        row.Label        = tierDetail.Label ?? row.Label;
                        row.KeywordsJson = newKeywordsJson;
                        row.UpdatedAt    = DateTime.UtcNow;
                        row.UpdatedBy    = cmd.RestoredBy;
                        await _repo.UpdateMultiplierAsync(row);
                    }
                }

                if (payload.RiskMultipliers != null)
                {
                    var riskRows = await _repo.GetMultipliersAsync(region, "risk_factor");
                    foreach (var row in riskRows)
                    {
                        if (!payload.RiskMultipliers.TryGetValue(row.FactorKey, out var snap)) continue;
                        if (row.Multiplier == snap) continue;

                        logs.Add(RateConfigAuditService.Log("RiskMultiplierConfigs", row.Id,
                            $"{row.FactorKey} → Multiplier",
                            row.Multiplier.ToString("F4"), snap.ToString("F4")));

                        row.Multiplier = snap;
                        row.UpdatedAt  = DateTime.UtcNow;
                        row.UpdatedBy  = cmd.RestoredBy;
                        await _repo.UpdateMultiplierAsync(row);
                    }
                }

                await _repo.SaveChangesAsync();

                var note  = string.IsNullOrWhiteSpace(cmd.Note) ? string.Empty : $" — {cmd.Note}";
                var label = $"Restored from snapshot '{snapshot.Label}'{note} ({logs.Count} field(s) reverted)";

                await _audit.RecordAsync(region, cmd.RestoredBy, label, "restored", logs);
                await _repo.SaveChangesAsync();

                return new RestoreSnapshotResult
                {
                    RestoredSnapshotId = cmd.SnapshotId,
                    FieldsReverted     = logs.Count,
                    Message            = label,
                };
            }
        }

        private class SnapshotPayload
        {
            public string?  AreaUnit            { get; set; }
            public decimal  AreaMin             { get; set; }
            public decimal  AreaMax             { get; set; }
            public decimal  StoreyIncrementPct  { get; set; }
            public int      MaxStoreys          { get; set; }
            public decimal  ProfessionalFeeRate { get; set; }
            public int      BenchmarkYear       { get; set; }
            public string?  BuildingRatesJson   { get; set; }
            public Dictionary<string, TierPayload>? LocationTiers   { get; set; }
            public Dictionary<string, decimal>?     RiskMultipliers { get; set; }
        }

        private class TierPayload
        {
            public decimal      Multiplier { get; set; }
            public string?      Label      { get; set; }
            public List<string>? Keywords  { get; set; }
        }
    }

    public class RestoreSnapshotResult
    {
        public string RestoredSnapshotId { get; set; } = string.Empty;
        public int    FieldsReverted     { get; set; }
        public string Message            { get; set; } = string.Empty;
    }
}
