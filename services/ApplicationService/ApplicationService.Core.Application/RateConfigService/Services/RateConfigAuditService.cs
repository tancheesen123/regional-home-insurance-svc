using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Services
{
    /// <summary>
    /// Shared helper that builds a full region snapshot and writes change-log entries.
    /// Change logs are now embedded as JSON in RateConfigSnapshot.ChangeLogsJson.
    /// </summary>
    public class RateConfigAuditService
    {
        private readonly IRateConfigRepository _repo;

        public RateConfigAuditService(IRateConfigRepository repo)
        {
            _repo = repo;
        }

        public Task<string> CaptureSnapshotJsonAsync(string region) =>
            BuildSnapshotJsonAsync(region);

        public async Task RecordAsync(
            string                         region,
            string                         changedBy,
            string                         label,
            string                         snapshotType,
            List<RateConfigChangeLogDto>   changeLogs,
            string?                        preBuiltSnapshotJson = null)
        {
            var snapshotJson = preBuiltSnapshotJson ?? await BuildSnapshotJsonAsync(region);

            // Populate audit fields on each log entry
            var now = DateTime.UtcNow;
            foreach (var log in changeLogs)
            {
                log.ChangedBy = changedBy;
                log.ChangedAt = now;
            }

            var changeLogsJson = JsonSerializer.Serialize(changeLogs);

            var snapshot = new RateConfigSnapshot
            {
                Region          = region,
                Label           = label,
                SnapshotJson    = snapshotJson,
                SnapshotType    = snapshotType,
                ChangeLogsJson  = changeLogsJson,
                CreatedBy       = changedBy,
            };

            await _repo.SaveSnapshotAsync(snapshot);
        }

        private async Task<string> BuildSnapshotJsonAsync(string region)
        {
            var regionConfig    = await _repo.GetRegionConfigAsync(region);
            var locationTiers   = await _repo.GetMultipliersAsync(region, "location_tier");
            var riskMultipliers = await _repo.GetMultipliersAsync(region, "risk_factor");

            var tiersDict = locationTiers.ToDictionary(
                t => t.FactorKey.ToLower(),
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
                buildingRatesJson   = regionConfig?.BuildingRatesJson   ?? "[]",
                locationTiers       = tiersDict,
                riskMultipliers     = riskDict,
            };

            return JsonSerializer.Serialize(snapshot, new JsonSerializerOptions { WriteIndented = false });
        }

        private static List<string> DeserializeKeywords(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return new();
            try { return JsonSerializer.Deserialize<List<string>>(json) ?? new(); }
            catch { return new(); }
        }

        public static RateConfigChangeLogDto Log(
            string tableName, string recordId, string fieldName,
            string oldValue,  string newValue) => new()
        {
            Id        = Guid.NewGuid().ToString(),
            TableName = tableName,
            RecordId  = recordId,
            FieldName = fieldName,
            OldValue  = oldValue,
            NewValue  = newValue,
        };
    }
}
