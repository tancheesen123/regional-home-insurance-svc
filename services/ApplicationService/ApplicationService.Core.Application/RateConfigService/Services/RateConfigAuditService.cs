using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Services
{
    /// <summary>
    /// Shared helper that builds a full region snapshot and writes change-log rows.
    /// Injected into every update command handler so audit happens automatically.
    /// </summary>
    public class RateConfigAuditService
    {
        private readonly IRateConfigRepository _repo;

        public RateConfigAuditService(IRateConfigRepository repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Takes a full JSON snapshot of the current region config, links it to the
        /// supplied change-log entries, and saves everything in one batch.
        /// Call this AFTER applying changes but BEFORE SaveChangesAsync.
        /// </summary>
        public async Task RecordAsync(
            string                    region,
            string                    changedBy,
            string                    label,
            string                    snapshotType,
            List<RateConfigChangeLog> changeLogs)
        {
            // Build full-region config snapshot JSON (reads the already-updated rows)
            var snapshotJson = await BuildSnapshotJsonAsync(region);

            var snapshot = new RateConfigSnapshot
            {
                Region       = region,
                Label        = label,
                SnapshotJson = snapshotJson,
                SnapshotType = snapshotType,
                CreatedBy    = changedBy,
            };

            await _repo.SaveSnapshotAsync(snapshot);

            // Link each change-log row to this snapshot
            foreach (var log in changeLogs)
            {
                log.SnapshotId = snapshot.Id;
                log.Region     = region;
                log.ChangedBy  = changedBy;
                log.ChangedAt  = DateTime.UtcNow;
            }

            await _repo.SaveChangeLogsAsync(changeLogs);
        }

        // ── Snapshot builder ──────────────────────────────────────────────────

        private async Task<string> BuildSnapshotJsonAsync(string region)
        {
            var buildingRates   = await _repo.GetBuildingRatesAsync(region);
            var regionConfig    = await _repo.GetRegionConfigAsync(region);
            var locationTiers   = await _repo.GetLocationTiersAsync(region);
            var riskMultipliers = await _repo.GetRiskMultipliersAsync(region);

            var ratesDict = buildingRates
                .GroupBy(r => r.PropertySubType.ToLower())
                .ToDictionary(
                    g => g.Key,
                    g => new ConstructionRateDetail
                    {
                        FullBrick    = g.FirstOrDefault(r =>
                            r.ConstructionType.Equals("full-brick",
                                StringComparison.OrdinalIgnoreCase))?.RatePerUnit ?? 0m,
                        PartialBrick = g.FirstOrDefault(r =>
                            r.ConstructionType.Equals("partial-brick",
                                StringComparison.OrdinalIgnoreCase))?.RatePerUnit ?? 0m,
                    });

            var tiersDict = locationTiers.ToDictionary(
                t => t.Tier.ToLower(),
                t => new LocationTierDetail
                {
                    Multiplier = t.Multiplier,
                    Label      = t.Label,
                    Keywords   = DeserializeKeywords(t.KeywordsJson),
                });

            var riskDict = riskMultipliers.ToDictionary(
                m => m.FactorKey,
                m => m.Multiplier);

            var snapshot = new
            {
                countryCode         = region,
                areaUnit            = regionConfig?.AreaUnit            ?? string.Empty,
                areaMin             = regionConfig?.AreaMin             ?? 0m,
                areaMax             = regionConfig?.AreaMax             ?? 0m,
                storeyIncrementPct  = regionConfig?.StoreyIncrementPct  ?? 0m,
                maxStoreys          = regionConfig?.MaxStoreys          ?? 0,
                professionalFeeRate = regionConfig?.ProfessionalFeeRate ?? 0m,
                benchmarkYear       = regionConfig?.BenchmarkYear       ?? 0,
                locationTiers       = tiersDict,
                rates               = ratesDict,
                riskMultipliers     = riskDict,
            };

            return JsonSerializer.Serialize(snapshot,
                new JsonSerializerOptions { WriteIndented = false });
        }

        private static List<string> DeserializeKeywords(string json)
        {
            try { return JsonSerializer.Deserialize<List<string>>(json) ?? new(); }
            catch { return new(); }
        }

        // ── Change-log builder helpers ────────────────────────────────────────

        public static RateConfigChangeLog Log(
            string tableName, string recordId, string fieldName,
            string oldValue,  string newValue) => new()
        {
            TableName = tableName,
            RecordId  = recordId,
            FieldName = fieldName,
            OldValue  = oldValue,
            NewValue  = newValue,
        };
    }
}
