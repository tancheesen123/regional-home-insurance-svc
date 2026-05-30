using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories
{
    public interface IRateConfigRepository
    {
        // ── BuildingConstructionRates ──────────────────────────────────────────
        Task<List<BuildingConstructionRate>> GetBuildingRatesAsync(string region);
        Task<BuildingConstructionRate?> GetBuildingRateByIdAsync(string id);
        Task UpdateBuildingRateAsync(BuildingConstructionRate rate);

        // ── RegionRateConfig ──────────────────────────────────────────────────
        Task<RegionRateConfig?> GetRegionConfigAsync(string region);
        Task<RegionRateConfig?> GetRegionConfigByIdAsync(string id);
        Task UpdateRegionConfigAsync(RegionRateConfig config);

        // ── LocationTierConfig ────────────────────────────────────────────────
        Task<List<LocationTierConfig>> GetLocationTiersAsync(string region);
        Task<LocationTierConfig?> GetLocationTierByIdAsync(string id);
        Task UpdateLocationTierAsync(LocationTierConfig tier);

        // ── RiskMultiplierConfig ──────────────────────────────────────────────
        Task<List<RiskMultiplierConfig>> GetRiskMultipliersAsync(string region);
        Task<RiskMultiplierConfig?> GetRiskMultiplierByIdAsync(string id);
        Task UpdateRiskMultiplierAsync(RiskMultiplierConfig config);

        // ── Snapshots ─────────────────────────────────────────────────────────
        Task<RateConfigSnapshot> SaveSnapshotAsync(RateConfigSnapshot snapshot);
        Task SaveChangeLogsAsync(List<RateConfigChangeLog> logs);
        Task<List<RateConfigSnapshot>> GetSnapshotsAsync(string region);
        Task<RateConfigSnapshot?> GetSnapshotByIdAsync(string snapshotId);

        // ── Change logs ───────────────────────────────────────────────────────
        Task<List<RateConfigChangeLog>> GetChangeLogsAsync(string region, int pageSize, int page);

        // ── Seeder ────────────────────────────────────────────────────────────
        Task<bool> HasBuildingRatesAsync(string region);
        Task SeedBuildingRatesAsync(List<BuildingConstructionRate> rates);
        Task SeedRegionConfigAsync(RegionRateConfig config);
        Task SeedLocationTiersAsync(List<LocationTierConfig> tiers);
        Task SeedRiskMultipliersAsync(List<RiskMultiplierConfig> multipliers);
        /// <summary>
        /// Returns all FactorKeys that already exist for the region.
        /// Used by patch-seed to avoid inserting duplicates.
        /// </summary>
        Task<HashSet<string>> GetExistingRiskMultiplierKeysAsync(string region);
        Task SaveChangesAsync();
    }
}
