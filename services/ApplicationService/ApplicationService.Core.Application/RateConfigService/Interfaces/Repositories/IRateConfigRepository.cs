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

        // ── Seeder ────────────────────────────────────────────────────────────
        Task<bool> HasBuildingRatesAsync(string region);
        Task SeedBuildingRatesAsync(List<BuildingConstructionRate> rates);
        Task SeedRegionConfigAsync(RegionRateConfig config);
        Task SeedLocationTiersAsync(List<LocationTierConfig> tiers);
        Task SeedRiskMultipliersAsync(List<RiskMultiplierConfig> multipliers);
        Task SaveChangesAsync();
    }
}
