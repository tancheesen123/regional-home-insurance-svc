using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Command
{
    /// <summary>
    /// Seeds initial rate configuration for one region.
    /// Safe to call multiple times — skips seeding if data already exists for that region.
    /// Call once per region (PH, ID, KH) from the admin dashboard or startup.
    /// </summary>
    public class SeedRateConfigCommand : IRequest<SeedRateConfigResult>
    {
        /// <summary>Region to seed: PH | ID | KH</summary>
        public string Region { get; set; } = string.Empty;

        public class Handler : IRequestHandler<SeedRateConfigCommand, SeedRateConfigResult>
        {
            private readonly IRateConfigRepository           _repo;
            private readonly ILogger<Handler>                _logger;

            public Handler(IRateConfigRepository repo, ILogger<Handler> logger)
            {
                _repo   = repo;
                _logger = logger;
            }

            public async Task<SeedRateConfigResult> Handle(
                SeedRateConfigCommand cmd, CancellationToken ct)
            {
                var region = cmd.Region.ToUpper();

                if (region is not ("PH" or "ID" or "KH"))
                    throw new ArgumentException($"Invalid region '{region}'. Valid values: PH, ID, KH.");

                // Skip if already seeded
                if (await _repo.HasBuildingRatesAsync(region))
                {
                    _logger.LogInformation("SeedRateConfig | Region {Region} already seeded — skipped.", region);
                    return new SeedRateConfigResult { Seeded = false, Message = $"Region {region} is already seeded." };
                }

                _logger.LogInformation("SeedRateConfig | Seeding region {Region}…", region);

                await _repo.SeedBuildingRatesAsync(BuildBuildingRates(region));
                await _repo.SeedRegionConfigAsync(BuildRegionConfig(region));
                await _repo.SeedLocationTiersAsync(BuildLocationTiers(region));
                await _repo.SeedRiskMultipliersAsync(BuildRiskMultipliers(region));
                await _repo.SaveChangesAsync();

                _logger.LogInformation("SeedRateConfig | Region {Region} seeded successfully.", region);
                return new SeedRateConfigResult { Seeded = true, Message = $"Region {region} seeded successfully." };
            }

            // ── Building construction rates ───────────────────────────────────
            // Source: building-rates.ts → rates[country][propertyType][constructionType]

            private static List<BuildingConstructionRate> BuildBuildingRates(string region)
            {
                // (propertySubType, fullBrick, partialBrick)
                var rows = region switch
                {
                    "PH" => new (string, decimal, decimal)[]
                    {
                        ("bungalow",      28_000m, 22_000m),
                        ("semi-detached", 25_500m, 20_000m),
                        ("terrace",       22_500m, 18_000m),
                        ("condo",         33_000m, 27_000m),
                        ("apartment",     20_500m, 16_500m),
                        ("flat",          15_500m, 12_500m),
                    },
                    "ID" => new (string, decimal, decimal)[]
                    {
                        ("bungalow",      5_800_000m, 4_600_000m),
                        ("semi-detached", 5_200_000m, 4_200_000m),
                        ("terrace",       4_700_000m, 3_700_000m),
                        ("condo",         6_200_000m, 5_100_000m),
                        ("apartment",     4_200_000m, 3_300_000m),
                        ("flat",          3_100_000m, 2_500_000m),
                    },
                    "KH" => new (string, decimal, decimal)[]
                    {
                        ("bungalow",      520m, 390m),
                        ("semi-detached", 460m, 350m),
                        ("terrace",       390m, 295m),
                        ("condo",         570m, 430m),
                        ("apartment",     360m, 275m),
                        ("flat",          260m, 200m),
                    },
                    _ => Array.Empty<(string, decimal, decimal)>()
                };

                var list = new List<BuildingConstructionRate>();
                foreach (var (subType, fullBrick, partialBrick) in rows)
                {
                    list.Add(New<BuildingConstructionRate>(r =>
                    {
                        r.Region           = region;
                        r.PropertySubType  = subType;
                        r.ConstructionType = "full-brick";
                        r.RatePerUnit      = fullBrick;
                    }));
                    list.Add(New<BuildingConstructionRate>(r =>
                    {
                        r.Region           = region;
                        r.PropertySubType  = subType;
                        r.ConstructionType = "partial-brick";
                        r.RatePerUnit      = partialBrick;
                    }));
                }
                return list;
            }

            // ── Region config ─────────────────────────────────────────────────
            // Source: building-rates.ts → AREA_LIMITS[country], storeyIncrementPct, professionalFeeRate

            private static RegionRateConfig BuildRegionConfig(string region) =>
                region switch
                {
                    "PH" => New<RegionRateConfig>(c =>
                    {
                        c.Region             = "PH";
                        c.AreaUnit           = "sqm";
                        c.AreaMin            = 40m;
                        c.AreaMax            = 1_000m;
                        c.StoreyIncrementPct = 0.05m;
                        c.MaxStoreys         = 5;
                        c.ProfessionalFeeRate= 0.10m;
                        c.BenchmarkYear      = 2024;
                    }),
                    "ID" => New<RegionRateConfig>(c =>
                    {
                        c.Region             = "ID";
                        c.AreaUnit           = "sqm";
                        c.AreaMin            = 36m;
                        c.AreaMax            = 1_000m;
                        c.StoreyIncrementPct = 0.05m;
                        c.MaxStoreys         = 5;
                        c.ProfessionalFeeRate= 0.10m;
                        c.BenchmarkYear      = 2024;
                    }),
                    "KH" => New<RegionRateConfig>(c =>
                    {
                        c.Region             = "KH";
                        c.AreaUnit           = "sqm";
                        c.AreaMin            = 30m;
                        c.AreaMax            = 800m;
                        c.StoreyIncrementPct = 0.05m;
                        c.MaxStoreys         = 5;
                        c.ProfessionalFeeRate= 0.10m;
                        c.BenchmarkYear      = 2024;
                    }),
                    _ => throw new ArgumentException($"Unknown region '{region}'")
                };

            // ── Location tiers ────────────────────────────────────────────────
            // Source: building-rates.ts → LOCATION_MULTIPLIERS, LOCATION_LABELS, PROVINCE_TIERS

            private static List<LocationTierConfig> BuildLocationTiers(string region)
            {
                // (tier, multiplier, label, keywords[])
                var tiers = region switch
                {
                    "PH" => new (string, decimal, string, string[])[]
                    {
                        ("prime", 1.12m,
                            "Metro Manila / BGC / Makati",
                            new[]{ "national capital region","ncr","metro manila" }),

                        ("urban", 1.00m,
                            "Provincial Cities & Urban Areas",
                            new[]{ "cebu","davao","iloilo","cagayan","laguna","cavite","rizal",
                                   "bulacan","pampanga","batangas","negros occidental","zamboanga" }),

                        ("rural", 0.88m,
                            "Rural & Remote Areas",
                            Array.Empty<string>()),
                    },
                    "ID" => new (string, decimal, string, string[])[]
                    {
                        ("prime", 1.12m,
                            "Jabodetabek / Bali / Surabaya",
                            new[]{ "jakarta","bali" }),

                        ("urban", 1.00m,
                            "Kota Besar Lainnya",
                            new[]{ "jawa","banten","yogyakarta","sumatera utara","sumatera selatan",
                                   "sulawesi selatan","kalimantan timur","kepulauan riau" }),

                        ("rural", 0.88m,
                            "Kota Kecil & Pedesaan",
                            Array.Empty<string>()),
                    },
                    "KH" => new (string, decimal, string, string[])[]
                    {
                        ("prime", 1.12m,
                            "Phnom Penh / BKK / Daun Penh",
                            new[]{ "phnom penh" }),

                        ("urban", 1.00m,
                            "Siem Reap / Sihanoukville / Other Cities",
                            new[]{ "siem reap","siemreap","preah sihanouk","sihanoukville","battambang" }),

                        ("rural", 0.88m,
                            "Provincial & Rural Areas",
                            Array.Empty<string>()),
                    },
                    _ => Array.Empty<(string, decimal, string, string[])>()
                };

                return tiers.Select(t => New<LocationTierConfig>(cfg =>
                {
                    cfg.Region       = region;
                    cfg.Tier         = t.Item1;
                    cfg.Multiplier   = t.Item2;
                    cfg.Label        = t.Item3;
                    cfg.KeywordsJson = JsonSerializer.Serialize(t.Item4);
                })).ToList();
            }

            // ── Risk multipliers ──────────────────────────────────────────────
            // Source: QuotationService.cs hardcoded multipliers (moved to DB)

            private static List<RiskMultiplierConfig> BuildRiskMultipliers(string region) =>
                new()
                {
                    // ── Initial rough-quote multipliers ──────────────────────────────
                    Risk(region, "base.premium",              500m,  "Fixed base amount before any multipliers (initial quote only)"),

                    Risk(region, "construction.full-brick",   1.00m, "Full-brick construction — base rate (no surcharge)"),
                    Risk(region, "construction.partial-brick",1.30m, "Partial-brick construction — 30% surcharge"),

                    Risk(region, "storey.1",                  1.00m, "Single-storey property — base rate"),
                    Risk(region, "storey.2",                  1.10m, "Two-storey property — 10% surcharge"),
                    Risk(region, "storey.3plus",              1.20m, "Three or more storeys — 20% surcharge"),

                    Risk(region, "risk.flooding",             1.25m, "Property currently in a flood-prone area — 25% loading"),
                    Risk(region, "risk.unoccupied",           1.20m, "Unoccupied property — 20% loading"),
                    Risk(region, "risk.previous-loss",        1.15m, "Previous insurance loss on record — 15% loading"),

                    // ── Building Cost Calculator — Age of building ────────────────
                    Risk(region, "age.1to10",                 1.00m, "Building age 1–10 years — no surcharge"),
                    Risk(region, "age.11to20",                1.05m, "Building age 11–20 years — 5% surcharge"),
                    Risk(region, "age.21to30",                1.10m, "Building age 21–30 years — 10% surcharge"),
                    Risk(region, "age.30plus",                1.15m, "Building age 30+ years — 15% surcharge"),

                    // ── Building Cost Calculator — Quality of property ────────────
                    Risk(region, "quality.low",               0.80m, "Low quality finishes — 20% reduction on build cost"),
                    Risk(region, "quality.standard",          1.00m, "Standard quality finishes — base rate"),
                    Risk(region, "quality.high",              1.25m, "High quality finishes — 25% surcharge"),

                    // ── Building Cost Calculator — Topography ─────────────────────
                    Risk(region, "topography.flat",           1.00m, "Flat topography — no surcharge"),
                    Risk(region, "topography.slope",          1.10m, "Sloped topography — 10% surcharge for foundation/grading"),

                    // ── Building Cost Calculator — Site surrounding ───────────────
                    Risk(region, "site.normal",               1.00m, "Normal site access — no surcharge"),
                    Risk(region, "site.confined",             1.10m, "Confined site — 10% surcharge for restricted access"),
                    Risk(region, "site.city-centre",          1.15m, "City centre — 15% surcharge for logistics and access"),
                };

            // ── Helpers ───────────────────────────────────────────────────────

            private static RiskMultiplierConfig Risk(
                string region, string key, decimal multiplier, string description) =>
                New<RiskMultiplierConfig>(r =>
                {
                    r.Region      = region;
                    r.FactorKey   = key;
                    r.Multiplier  = multiplier;
                    r.Description = description;
                });

            /// <summary>
            /// Creates an entity and applies the config action.
            /// Id and CreatedAt are set automatically by TransactionBaseEntity defaults.
            /// </summary>
            private static T New<T>(Action<T> configure) where T : class, new()
            {
                var entity = new T();
                configure(entity);
                return entity;
            }
        }
    }

    public class SeedRateConfigResult
    {
        public bool   Seeded  { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
