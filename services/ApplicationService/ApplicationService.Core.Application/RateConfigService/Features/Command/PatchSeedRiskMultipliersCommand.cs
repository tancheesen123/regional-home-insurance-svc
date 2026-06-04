using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using MediatR;

namespace ApplicationService.Core.Application.RateConfigService.Features.Command
{
    /// <summary>
    /// Inserts any missing RateMultiplierConfig rows (type=risk_factor) for a region.
    /// Safe to call multiple times — skips keys that already exist.
    /// </summary>
    public class PatchSeedRiskMultipliersCommand : IRequest<PatchSeedResult>
    {
        public string Region { get; set; } = string.Empty;

        public class Handler : IRequestHandler<PatchSeedRiskMultipliersCommand, PatchSeedResult>
        {
            private readonly IRateConfigRepository _repo;

            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<PatchSeedResult> Handle(
                PatchSeedRiskMultipliersCommand cmd, CancellationToken ct)
            {
                var region = cmd.Region.ToUpper();

                if (region is not ("PH" or "ID" or "KH"))
                    throw new ArgumentException($"Invalid region '{region}'. Valid values: PH, ID, KH.");

                var existingKeys = await _repo.GetExistingMultiplierKeysAsync(region, "risk_factor");
                var expected     = AllExpectedMultipliers(region);
                var missing      = expected.Where(m => !existingKeys.Contains(m.FactorKey)).ToList();

                if (missing.Count == 0)
                    return new PatchSeedResult
                    {
                        Inserted = 0,
                        Message  = $"Region {region}: all risk multiplier keys are already present.",
                        Keys     = new List<string>(),
                    };

                await _repo.SeedMultipliersAsync(missing);
                await _repo.SaveChangesAsync();

                return new PatchSeedResult
                {
                    Inserted = missing.Count,
                    Message  = $"Region {region}: inserted {missing.Count} missing multiplier key(s).",
                    Keys     = missing.Select(m => m.FactorKey).OrderBy(k => k).ToList(),
                };
            }

            private static List<RateMultiplierConfig> AllExpectedMultipliers(string region)
            {
                static RateMultiplierConfig Row(string reg, string key, decimal val, string desc) =>
                    new() { Region = reg, Type = "risk_factor", FactorKey = key, Multiplier = val, Description = desc, Label = desc };

                return new List<RateMultiplierConfig>
                {
                    Row(region, "base.premium",               500m,  "Fixed base amount before any multipliers"),
                    Row(region, "construction.full-brick",    1.00m, "Full-brick construction — base rate"),
                    Row(region, "construction.partial-brick", 1.30m, "Partial-brick construction — 30% surcharge"),
                    Row(region, "storey.1",                   1.00m, "Single-storey — base rate"),
                    Row(region, "storey.2",                   1.10m, "Two-storey — 10% surcharge"),
                    Row(region, "storey.3plus",               1.20m, "Three+ storeys — 20% surcharge"),
                    Row(region, "risk.flooding",              1.25m, "Flood-prone area — 25% loading"),
                    Row(region, "risk.unoccupied",            1.20m, "Unoccupied property — 20% loading"),
                    Row(region, "risk.previous-loss",         1.15m, "Previous loss on record — 15% loading"),
                    Row(region, "age.1to10",                  1.00m, "Building age 1–10 years — no surcharge"),
                    Row(region, "age.11to20",                 1.05m, "Building age 11–20 years — 5% surcharge"),
                    Row(region, "age.21to30",                 1.10m, "Building age 21–30 years — 10% surcharge"),
                    Row(region, "age.30plus",                 1.15m, "Building age 30+ years — 15% surcharge"),
                    Row(region, "quality.low",                0.80m, "Low quality finishes — 20% reduction"),
                    Row(region, "quality.standard",           1.00m, "Standard quality — base rate"),
                    Row(region, "quality.high",               1.25m, "High quality finishes — 25% surcharge"),
                    Row(region, "topography.flat",            1.00m, "Flat topography — no surcharge"),
                    Row(region, "topography.slope",           1.10m, "Sloped topography — 10% surcharge"),
                    Row(region, "site.normal",                1.00m, "Normal site access — no surcharge"),
                    Row(region, "site.confined",              1.10m, "Confined site — 10% surcharge"),
                    Row(region, "site.city-centre",           1.15m, "City centre — 15% surcharge"),
                };
            }
        }
    }

    public class PatchSeedResult
    {
        public int          Inserted { get; set; }
        public string       Message  { get; set; } = string.Empty;
        public List<string> Keys     { get; set; } = new();
    }
}
