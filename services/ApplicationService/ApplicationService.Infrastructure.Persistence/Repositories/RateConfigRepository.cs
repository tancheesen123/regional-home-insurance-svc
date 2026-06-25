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


        public Task<RegionConfig?> GetRegionConfigAsync(string region) =>
            Db.RegionConfigs
              .Where(r => r.Region == region && r.IsActive)
              .FirstOrDefaultAsync();

        public Task<RegionConfig?> GetRegionConfigByIdAsync(string id) =>
            Db.RegionConfigs.FirstOrDefaultAsync(r => r.Id == id);

        public async Task UpdateRegionConfigAsync(RegionConfig config)
        {
            Db.RegionConfigs.Update(config);
            await Task.CompletedTask;
        }


        public Task<List<RateMultiplierConfig>> GetMultipliersAsync(string region, string type) =>
            Db.RateMultiplierConfigs
              .Where(r => (r.Region == region || r.Region == "ALL") && r.Type == type && r.IsActive)
              .OrderBy(r => r.Region).ThenBy(r => r.FactorKey)
              .ToListAsync();

        public Task<RateMultiplierConfig?> GetMultiplierByIdAsync(string id) =>
            Db.RateMultiplierConfigs.FirstOrDefaultAsync(r => r.Id == id);

        public async Task UpdateMultiplierAsync(RateMultiplierConfig config)
        {
            Db.RateMultiplierConfigs.Update(config);
            await Task.CompletedTask;
        }


        public Task<List<AddOn>> GetAddOnsAsync() =>
            Db.AddOns.Where(a => a.IsActive).OrderBy(a => a.Code).ToListAsync();

        public Task<AddOn?> GetAddOnByCodeAsync(string code) =>
            Db.AddOns.FirstOrDefaultAsync(a => a.Code == code);

        public async Task UpdateAddOnAsync(AddOn addOn)
        {
            Db.AddOns.Update(addOn);
            await Task.CompletedTask;
        }


        public async Task<RateConfigSnapshot> SaveSnapshotAsync(RateConfigSnapshot snapshot)
        {
            await Db.RateConfigSnapshots.AddAsync(snapshot);
            return snapshot;
        }

        public Task<List<RateConfigSnapshot>> GetSnapshotsAsync(string region) =>
            Db.RateConfigSnapshots
              .Where(s => s.Region == region)
              .OrderByDescending(s => s.CreatedAt)
              .ToListAsync();

        public Task<RateConfigSnapshot?> GetSnapshotByIdAsync(string snapshotId) =>
            Db.RateConfigSnapshots
              .FirstOrDefaultAsync(s => s.Id == snapshotId);


        public Task<bool> HasRegionConfigAsync(string region) =>
            Db.RegionConfigs.AnyAsync(r => r.Region == region);

        public async Task SeedRegionConfigAsync(RegionConfig config)
        {
            await Db.RegionConfigs.AddAsync(config);
        }

        public async Task SeedMultipliersAsync(List<RateMultiplierConfig> multipliers)
        {
            await Db.RateMultiplierConfigs.AddRangeAsync(multipliers);
        }

        public async Task SeedAddOnsAsync(List<AddOn> addOns)
        {
            await Db.AddOns.AddRangeAsync(addOns);
        }

        public async Task<HashSet<string>> GetExistingMultiplierKeysAsync(string region, string type)
        {
            var keys = await Db.RateMultiplierConfigs
                .Where(r => r.Region == region && r.Type == type)
                .Select(r => r.FactorKey)
                .ToListAsync();
            return new HashSet<string>(keys, StringComparer.OrdinalIgnoreCase);
        }

        public Task SaveChangesAsync() => Db.SaveChangesAsync();
    }
}
