using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Application.RateConfigService.Services;
using ApplicationService.Core.Domain.Entities;
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

            public Handler(IRateConfigRepository repo, RateConfigAuditService audit)
            {
                _repo  = repo;
                _audit = audit;
            }

            public async Task<RestoreSnapshotResult> Handle(
                RestoreSnapshotCommand cmd, CancellationToken ct)
            {
                // 1. Load the target snapshot
                var snapshot = await _repo.GetSnapshotByIdAsync(cmd.SnapshotId)
                    ?? throw new KeyNotFoundException(
                        $"Snapshot '{cmd.SnapshotId}' not found.");

                // 2. Parse snapshot JSON
                SnapshotPayload payload;
                try
                {
                    payload = JsonSerializer.Deserialize<SnapshotPayload>(
                        snapshot.SnapshotJson,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                        ?? throw new InvalidOperationException("Snapshot JSON is empty.");
                }
                catch (JsonException ex)
                {
                    throw new InvalidOperationException(
                        $"Snapshot JSON could not be parsed: {ex.Message}");
                }

                var region = cmd.Region.ToUpper();
                var logs   = new List<RateConfigChangeLog>();

                // 3. Restore RegionRateConfig ──────────────────────────────────
                var regionRow = await _repo.GetRegionConfigAsync(region);
                if (regionRow != null && payload != null)
                {
                    void TrackR(string field, string oldV, string newV)
                    {
                        if (oldV != newV)
                            logs.Add(RateConfigAuditService.Log(
                                "RegionRateConfigs", regionRow.Id, field, oldV, newV));
                    }

                    TrackR("AreaUnit",           regionRow.AreaUnit,                    payload.AreaUnit ?? regionRow.AreaUnit);
                    TrackR("AreaMin",             regionRow.AreaMin.ToString(),          payload.AreaMin.ToString());
                    TrackR("AreaMax",             regionRow.AreaMax.ToString(),          payload.AreaMax.ToString());
                    TrackR("StoreyIncrementPct",  regionRow.StoreyIncrementPct.ToString("F4"), payload.StoreyIncrementPct.ToString("F4"));
                    TrackR("MaxStoreys",          regionRow.MaxStoreys.ToString(),       payload.MaxStoreys.ToString());
                    TrackR("ProfessionalFeeRate", regionRow.ProfessionalFeeRate.ToString("F4"), payload.ProfessionalFeeRate.ToString("F4"));
                    TrackR("BenchmarkYear",       regionRow.BenchmarkYear.ToString(),   payload.BenchmarkYear.ToString());

                    regionRow.AreaUnit            = payload.AreaUnit ?? regionRow.AreaUnit;
                    regionRow.AreaMin             = payload.AreaMin;
                    regionRow.AreaMax             = payload.AreaMax;
                    regionRow.StoreyIncrementPct  = payload.StoreyIncrementPct;
                    regionRow.MaxStoreys          = payload.MaxStoreys;
                    regionRow.ProfessionalFeeRate = payload.ProfessionalFeeRate;
                    regionRow.BenchmarkYear       = payload.BenchmarkYear;
                    regionRow.UpdatedAt           = DateTime.UtcNow;
                    regionRow.UpdatedBy           = cmd.RestoredBy;
                    await _repo.UpdateRegionConfigAsync(regionRow);
                }

                // 4. Restore BuildingConstructionRates ────────────────────────
                if (payload?.Rates != null)
                {
                    var buildingRows = await _repo.GetBuildingRatesAsync(region);
                    foreach (var row in buildingRows)
                    {
                        var subKey = row.PropertySubType.ToLower();
                        if (!payload.Rates.TryGetValue(subKey, out var rateDetail)) continue;

                        decimal snap = row.ConstructionType.Equals("full-brick",
                            StringComparison.OrdinalIgnoreCase)
                            ? rateDetail.FullBrick
                            : rateDetail.PartialBrick;

                        if (row.RatePerUnit != snap)
                        {
                            logs.Add(RateConfigAuditService.Log(
                                "BuildingConstructionRates", row.Id,
                                $"{row.PropertySubType}/{row.ConstructionType} → RatePerUnit",
                                row.RatePerUnit.ToString("F4"),
                                snap.ToString("F4")));

                            row.RatePerUnit = snap;
                            row.UpdatedAt   = DateTime.UtcNow;
                            row.UpdatedBy   = cmd.RestoredBy;
                            await _repo.UpdateBuildingRateAsync(row);
                        }
                    }
                }

                // 5. Restore LocationTierConfigs ───────────────────────────────
                if (payload?.LocationTiers != null)
                {
                    var tierRows = await _repo.GetLocationTiersAsync(region);
                    foreach (var row in tierRows)
                    {
                        var key = row.Tier.ToLower();
                        if (!payload.LocationTiers.TryGetValue(key, out var tierDetail)) continue;

                        void TrackT(string field, string oldV, string newV)
                        {
                            if (oldV != newV)
                                logs.Add(RateConfigAuditService.Log(
                                    "LocationTierConfigs", row.Id,
                                    $"{row.Tier} → {field}", oldV, newV));
                        }

                        var newKeywordsJson = JsonSerializer.Serialize(
                            tierDetail.Keywords ?? new List<string>());

                        TrackT("Multiplier", row.Multiplier.ToString("F4"), tierDetail.Multiplier.ToString("F4"));
                        TrackT("Label",      row.Label,                     tierDetail.Label ?? row.Label);
                        TrackT("Keywords",   row.KeywordsJson,               newKeywordsJson);

                        row.Multiplier   = tierDetail.Multiplier;
                        row.Label        = tierDetail.Label ?? row.Label;
                        row.KeywordsJson = newKeywordsJson;
                        row.UpdatedAt    = DateTime.UtcNow;
                        row.UpdatedBy    = cmd.RestoredBy;
                        await _repo.UpdateLocationTierAsync(row);
                    }
                }

                // 6. Restore RiskMultiplierConfigs ─────────────────────────────
                if (payload?.RiskMultipliers != null)
                {
                    var riskRows = await _repo.GetRiskMultipliersAsync(region);
                    foreach (var row in riskRows)
                    {
                        if (!payload.RiskMultipliers.TryGetValue(row.FactorKey, out var snap)) continue;

                        if (row.Multiplier != snap)
                        {
                            logs.Add(RateConfigAuditService.Log(
                                "RiskMultiplierConfigs", row.Id,
                                $"{row.FactorKey} → Multiplier",
                                row.Multiplier.ToString("F4"),
                                snap.ToString("F4")));

                            row.Multiplier = snap;
                            row.UpdatedAt  = DateTime.UtcNow;
                            row.UpdatedBy  = cmd.RestoredBy;
                            await _repo.UpdateRiskMultiplierAsync(row);
                        }
                    }
                }

                // 7. Persist restored config rows
                await _repo.SaveChangesAsync();

                // 8. Audit the restore
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

        // ── Internal deserialization shapes ───────────────────────────────────

        private class SnapshotPayload
        {
            public string?  AreaUnit            { get; set; }
            public decimal  AreaMin             { get; set; }
            public decimal  AreaMax             { get; set; }
            public decimal  StoreyIncrementPct  { get; set; }
            public int      MaxStoreys          { get; set; }
            public decimal  ProfessionalFeeRate { get; set; }
            public int      BenchmarkYear       { get; set; }
            public Dictionary<string, TierPayload>?  LocationTiers   { get; set; }
            public Dictionary<string, RatePayload>?  Rates           { get; set; }
            public Dictionary<string, decimal>?      RiskMultipliers { get; set; }
        }

        private class TierPayload
        {
            public decimal      Multiplier { get; set; }
            public string?      Label      { get; set; }
            public List<string>? Keywords  { get; set; }
        }

        private class RatePayload
        {
            public decimal FullBrick    { get; set; }
            public decimal PartialBrick { get; set; }
        }
    }

    public class RestoreSnapshotResult
    {
        public string RestoredSnapshotId { get; set; } = string.Empty;
        public int    FieldsReverted     { get; set; }
        public string Message            { get; set; } = string.Empty;
    }
}
