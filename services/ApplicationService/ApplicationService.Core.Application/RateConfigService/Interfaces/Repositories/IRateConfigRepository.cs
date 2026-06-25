using ApplicationService.Core.Domain.Entities;

namespace ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories
{
    public interface IRateConfigRepository
    {
        Task<RegionConfig?> GetRegionConfigAsync(string region);
        Task<RegionConfig?> GetRegionConfigByIdAsync(string id);
        Task UpdateRegionConfigAsync(RegionConfig config);

        Task<List<RateMultiplierConfig>> GetMultipliersAsync(string region, string type);
        Task<RateMultiplierConfig?> GetMultiplierByIdAsync(string id);
        Task UpdateMultiplierAsync(RateMultiplierConfig config);

        Task<List<AddOn>> GetAddOnsAsync();
        Task<AddOn?> GetAddOnByCodeAsync(string code);
        Task UpdateAddOnAsync(AddOn addOn);

        Task<RateConfigSnapshot> SaveSnapshotAsync(RateConfigSnapshot snapshot);
        Task<List<RateConfigSnapshot>> GetSnapshotsAsync(string region);
        Task<RateConfigSnapshot?> GetSnapshotByIdAsync(string snapshotId);

        Task<bool> HasRegionConfigAsync(string region);
        Task SeedRegionConfigAsync(RegionConfig config);
        Task SeedMultipliersAsync(List<RateMultiplierConfig> multipliers);
        Task SeedAddOnsAsync(List<AddOn> addOns);
        Task<HashSet<string>> GetExistingMultiplierKeysAsync(string region, string type);

        Task SaveChangesAsync();
    }
}
