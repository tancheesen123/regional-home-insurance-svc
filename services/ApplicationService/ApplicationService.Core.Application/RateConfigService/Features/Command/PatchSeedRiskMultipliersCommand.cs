using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using MediatR;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Command
{
    /// <summary>
    /// Inserts any missing RiskMultiplierConfig rows for a region without touching existing data.
    /// Safe to call multiple times — skips keys that already exist.
    /// Use this when new multiplier keys are added to the system after the initial seed was run.
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
                    throw new ArgumentException(
                        $"Invalid region '{region}'. Valid values: PH, ID, KH.");

                // Load all keys already in the DB for this region
                var existingKeys = await _repo.GetExistingRiskMultiplierKeysAsync(region);

                // Full set of expected multiplier keys
                var expected = AllExpectedMultipliers(region);

                // Only insert the ones that are missing
                var missing = expected
                    .Where(m => !existingKeys.Contains(m.FactorKey))
                    .ToList();

                if (missing.Count == 0)
                    return new PatchSeedResult
                    {
                        Inserted = 0,
                        Message  = $"Region {region}: all multiplier keys are already present. Nothing to patch.",
                        Keys     = new List<string>(),
                    };

                await _repo.SeedRiskMultipliersAsync(missing);
                await _repo.SaveChangesAsync();

                return new PatchSeedResult
                {
                    Inserted = missing.Count,
                    Message  = $"Region {region}: inserted {missing.Count} missing multiplier key(s).",
                    Keys     = missing.Select(m => m.FactorKey).OrderBy(k => k).ToList(),
                };
            }

            private static List<RiskMultiplierConfig> AllExpectedMultipliers(string region)
            {
                static RiskMultiplierConfig Row(string reg, string key, decimal val, string desc)
                {
                    var r = new RiskMultiplierConfig
                    {
                        Region      = reg,
                        FactorKey   = key,
                        Multiplier  = val,
                        Description = desc,
                    };
                    return r;
                }

                return new List<RiskMultiplierConfig>
                {
                    // ── Initial rough-quote multipliers ──────────────────────
                    Row(region, "base.premium",               500m,  "Fixed base amount before any multipliers (initial quote only)"),
                    Row(region, "construction.full-brick",    1.00m, "Full-brick construction — base rate (no surcharge)"),
                    Row(region, "construction.partial-brick", 1.30m, "Partial-brick construction — 30% surcharge"),
                    Row(region, "storey.1",                   1.00m, "Single-storey property — base rate"),
                    Row(region, "storey.2",                   1.10m, "Two-storey property — 10% surcharge"),
                    Row(region, "storey.3plus",               1.20m, "Three or more storeys — 20% surcharge"),
                    Row(region, "risk.flooding",              1.25m, "Property in a flood-prone area — 25% loading"),
                    Row(region, "risk.unoccupied",            1.20m, "Unoccupied property — 20% loading"),
                    Row(region, "risk.previous-loss",         1.15m, "Previous insurance loss on record — 15% loading"),

                    // ── BCC — Age of building ────────────────────────────────
                    Row(region, "age.1to10",                  1.00m, "Building age 1–10 years — no surcharge"),
                    Row(region, "age.11to20",                 1.05m, "Building age 11–20 years — 5% surcharge"),
                    Row(region, "age.21to30",                 1.10m, "Building age 21–30 years — 10% surcharge"),
                    Row(region, "age.30plus",                 1.15m, "Building age 30+ years — 15% surcharge"),

                    // ── BCC — Quality of property ────────────────────────────
                    Row(region, "quality.low",                0.80m, "Low quality finishes — 20% reduction on build cost"),
                    Row(region, "quality.standard",           1.00m, "Standard quality finishes — base rate"),
                    Row(region, "quality.high",               1.25m, "High quality finishes — 25% surcharge"),

                    // ── BCC — Topography ─────────────────────────────────────
                    Row(region, "topography.flat",            1.00m, "Flat topography — no surcharge"),
                    Row(region, "topography.slope",           1.10m, "Sloped topography — 10% surcharge"),

                    // ── BCC — Site surrounding ───────────────────────────────
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
        /// <summary>The FactorKeys that were inserted.</summary>
        public List<string> Keys     { get; set; } = new();
    }
}
