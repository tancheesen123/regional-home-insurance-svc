using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class RateConfigRepository : IRateConfigRepository
    {
        private readonly DbContextResolver _resolver;

        public RateConfigRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        private ApplicationDbContext Db => _resolver.Resolve();

        // ── BuildingConstructionRates ──────────────────────────────────────────

        public Task<List<BuildingConstructionRate>> GetBuildingRatesAsync(string region) =>
            Db.BuildingConstructionRates
              .Where(r => r.Region == region && r.IsActive)
              .OrderBy(r => r.PropertySubType).ThenBy(r => r.ConstructionType)
              .ToListAsync();

        public Task<BuildingConstructionRate?> GetBuildingRateByIdAsync(string id) =>
            Db.BuildingConstructionRates.FirstOrDefaultAsync(r => r.Id == id);

        public async Task UpdateBuildingRateAsync(BuildingConstructionRate rate)
        {
            Db.BuildingConstructionRates.Update(rate);
            await Task.CompletedTask;
        }

        // ── RegionRateConfig ──────────────────────────────────────────────────

        public Task<RegionRateConfig?> GetRegionConfigAsync(string region) =>
            Db.RegionRateConfigs
              .Where(r => r.Region == region && r.IsActive)
              .FirstOrDefaultAsync();

        public Task<RegionRateConfig?> GetRegionConfigByIdAsync(string id) =>
            Db.RegionRateConfigs.FirstOrDefaultAsync(r => r.Id == id);

        public async Task UpdateRegionConfigAsync(RegionRateConfig config)
        {
            Db.RegionRateConfigs.Update(config);
            await Task.CompletedTask;
        }

        // ── LocationTierConfig ────────────────────────────────────────────────

        public Task<List<LocationTierConfig>> GetLocationTiersAsync(string region) =>
            Db.LocationTierConfigs
              .Where(t => t.Region == region && t.IsActive)
              .OrderBy(t => t.Tier)
              .ToListAsync();

        public Task<LocationTierConfig?> GetLocationTierByIdAsync(string id) =>
            Db.LocationTierConfigs.FirstOrDefaultAsync(t => t.Id == id);

        public async Task UpdateLocationTierAsync(LocationTierConfig tier)
        {
            Db.LocationTierConfigs.Update(tier);
            await Task.CompletedTask;
        }

        // ── RiskMultiplierConfig ──────────────────────────────────────────────

        public Task<List<RiskMultiplierConfig>> GetRiskMultipliersAsync(string region) =>
            Db.RiskMultiplierConfigs
              .Where(r => (r.Region == region || r.Region == "ALL") && r.IsActive)
              .OrderBy(r => r.Region).ThenBy(r => r.FactorKey)
              .ToListAsync();

        public Task<RiskMultiplierConfig?> GetRiskMultiplierByIdAsync(string id) =>
            Db.RiskMultiplierConfigs.FirstOrDefaultAsync(r => r.Id == id);

        public async Task UpdateRiskMultiplierAsync(RiskMultiplierConfig config)
        {
            Db.RiskMultiplierConfigs.Update(config);
            await Task.CompletedTask;
        }

        // ── Snapshots & Change Logs ───────────────────────────────────────────

        public async Task<RateConfigSnapshot> SaveSnapshotAsync(RateConfigSnapshot snapshot)
        {
            await Db.RateConfigSnapshots.AddAsync(snapshot);
            return snapshot;
        }

        public async Task SaveChangeLogsAsync(List<RateConfigChangeLog> logs)
        {
            if (logs.Count > 0)
                await Db.RateConfigChangeLogs.AddRangeAsync(logs);
        }

        public Task<List<RateConfigSnapshot>> GetSnapshotsAsync(string region) =>
            Db.RateConfigSnapshots
              .Where(s => s.Region == region)
              .OrderByDescending(s => s.CreatedAt)
              .ToListAsync();

        public Task<RateConfigSnapshot?> GetSnapshotByIdAsync(string snapshotId) =>
            Db.RateConfigSnapshots
              .Include(s => s.ChangeLogs)
              .FirstOrDefaultAsync(s => s.Id == snapshotId);

        public Task<List<RateConfigChangeLog>> GetChangeLogsAsync(
            string region, int pageSize, int page) =>
            Db.RateConfigChangeLogs
              .Where(l => l.Region == region)
              .OrderByDescending(l => l.ChangedAt)
              .Skip((page - 1) * pageSize)
              .Take(pageSize)
              .ToListAsync();

        // ── Seeder ────────────────────────────────────────────────────────────

        public Task<bool> HasBuildingRatesAsync(string region) =>
            Db.BuildingConstructionRates.AnyAsync(r => r.Region == region);

        public async Task SeedBuildingRatesAsync(List<BuildingConstructionRate> rates)
        {
            await Db.BuildingConstructionRates.AddRangeAsync(rates);
        }

        public async Task SeedRegionConfigAsync(RegionRateConfig config)
        {
            await Db.RegionRateConfigs.AddAsync(config);
        }

        public async Task SeedLocationTiersAsync(List<LocationTierConfig> tiers)
        {
            await Db.LocationTierConfigs.AddRangeAsync(tiers);
        }

        public async Task SeedRiskMultipliersAsync(List<RiskMultiplierConfig> multipliers)
        {
            await Db.RiskMultiplierConfigs.AddRangeAsync(multipliers);
        }

        public Task SaveChangesAsync() => Db.SaveChangesAsync();
    }
}
