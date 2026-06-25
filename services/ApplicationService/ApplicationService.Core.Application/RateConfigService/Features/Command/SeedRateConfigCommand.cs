using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Command
{
    public class SeedRateConfigCommand : IRequest<SeedRateConfigResult>
    {
        public string Region { get; set; } = string.Empty;

        public class Handler : IRequestHandler<SeedRateConfigCommand, SeedRateConfigResult>
        {
            private readonly IRateConfigRepository _repo;
            private readonly ILogger<Handler>      _logger;

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

                if (await _repo.HasRegionConfigAsync(region))
                {
                    _logger.LogInformation("SeedRateConfig | Region {Region} already seeded — skipped.", region);
                    return new SeedRateConfigResult { Seeded = false, Message = $"Region {region} is already seeded." };
                }

                _logger.LogInformation("SeedRateConfig | Seeding region {Region}…", region);

                var regionConfig = BuildRegionConfig(region);
                await _repo.SeedRegionConfigAsync(regionConfig);
                await _repo.SeedMultipliersAsync(BuildLocationTiers(region, regionConfig.Id));
                await _repo.SeedMultipliersAsync(BuildRiskMultipliers(region, regionConfig.Id));
                await _repo.SeedAddOnsAsync(BuildAddOns());
                await _repo.SaveChangesAsync();

                _logger.LogInformation("SeedRateConfig | Region {Region} seeded successfully.", region);
                return new SeedRateConfigResult { Seeded = true, Message = $"Region {region} seeded successfully." };
            }


            private static RegionConfig BuildRegionConfig(string region)
            {
                var buildingRates = BuildBuildingRateRows(region);
                var buildingRatesJson = JsonSerializer.Serialize(buildingRates);

                var valuableRates = BuildValuableRateRows(region);
                var valuableRatesJson = JsonSerializer.Serialize(valuableRates);

                return region switch
                {
                    "PH" => New<RegionConfig>(c =>
                    {
                        c.Region             = "PH";
                        c.BuildingRate       = 0.001m;
                        c.ContentRate        = 0.0015m;
                        c.MinBuildingSum     = 100_000m;
                        c.MaxBuildingSum     = null;
                        c.MinContentSum      = 50_000m;
                        c.MaxContentSum      = null;
                        c.ServiceTaxRate     = 12m;
                        c.StampDutyAmount    = 30m;
                        c.StampDutyWaiverEligiblePremium = 0m;
                        c.AreaUnit           = "sqm";
                        c.AreaMin            = 40m;
                        c.AreaMax            = 1_000m;
                        c.StoreyIncrementPct = 0.05m;
                        c.MaxStoreys         = 5;
                        c.ProfessionalFeeRate= 0.10m;
                        c.BenchmarkYear      = 2024;
                        c.BuildingRatesJson  = buildingRatesJson;
                        c.ValuableRatesJson  = valuableRatesJson;
                    }),
                    "ID" => New<RegionConfig>(c =>
                    {
                        c.Region             = "ID";
                        c.BuildingRate       = 0.001m;
                        c.ContentRate        = 0.0015m;
                        c.MinBuildingSum     = 100_000_000m;
                        c.MaxBuildingSum     = null;
                        c.MinContentSum      = 50_000_000m;
                        c.MaxContentSum      = null;
                        c.ServiceTaxRate     = 11m;
                        c.StampDutyAmount    = 0m;
                        c.StampDutyWaiverEligiblePremium = 0m;
                        c.AreaUnit           = "sqm";
                        c.AreaMin            = 36m;
                        c.AreaMax            = 1_000m;
                        c.StoreyIncrementPct = 0.05m;
                        c.MaxStoreys         = 5;
                        c.ProfessionalFeeRate= 0.10m;
                        c.BenchmarkYear      = 2024;
                        c.BuildingRatesJson  = buildingRatesJson;
                        c.ValuableRatesJson  = valuableRatesJson;
                    }),
                    "KH" => New<RegionConfig>(c =>
                    {
                        c.Region             = "KH";
                        c.BuildingRate       = 0.001m;
                        c.ContentRate        = 0.0015m;
                        c.MinBuildingSum     = 5_000m;
                        c.MaxBuildingSum     = null;
                        c.MinContentSum      = 2_000m;
                        c.MaxContentSum      = null;
                        c.ServiceTaxRate     = 10m;
                        c.StampDutyAmount    = 0m;
                        c.StampDutyWaiverEligiblePremium = 0m;
                        c.AreaUnit           = "sqm";
                        c.AreaMin            = 30m;
                        c.AreaMax            = 800m;
                        c.StoreyIncrementPct = 0.05m;
                        c.MaxStoreys         = 5;
                        c.ProfessionalFeeRate= 0.10m;
                        c.BenchmarkYear      = 2024;
                        c.BuildingRatesJson  = buildingRatesJson;
                        c.ValuableRatesJson  = valuableRatesJson;
                    }),
                    _ => throw new ArgumentException($"Unknown region '{region}'")
                };
            }

            private static List<object> BuildBuildingRateRows(string region)
            {
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

                var list = new List<object>();
                foreach (var (subType, fullBrick, partialBrick) in rows)
                {
                    list.Add(new { id = Guid.NewGuid().ToString(), propertySubType = subType, constructionType = "full-brick",    ratePerUnit = fullBrick,    isActive = true });
                    list.Add(new { id = Guid.NewGuid().ToString(), propertySubType = subType, constructionType = "partial-brick", ratePerUnit = partialBrick, isActive = true });
                }
                return list;
            }

            private static List<object> BuildValuableRateRows(string region)
            {
                var (maxPerItem, maxTotal) = region switch
                {
                    "PH" => (300_000m, 900_000m),
                    "ID" => (85_000_000m, 260_000_000m),
                    "KH" => (5_000m, 15_000m),
                    _    => (20_000m, 60_000m),
                };

                return new List<object>
                {
                    new { category = "jewellery",        maxPerItem, maxTotal, rate = 0.02m },
                    new { category = "electronics",      maxPerItem, maxTotal, rate = 0.015m },
                    new { category = "artwork",          maxPerItem, maxTotal, rate = 0.025m },
                    new { category = "sports-equipment", maxPerItem, maxTotal, rate = 0.015m },
                    new { category = "other",            maxPerItem, maxTotal, rate = 0.02m },
                };
            }

            private static List<RateMultiplierConfig> BuildLocationTiers(string region, string regionConfigId)
            {
                var tiers = region switch
                {
                    "PH" => new (string, decimal, string, string[])[]
                    {
                        ("prime", 1.12m, "Metro Manila / BGC / Makati",
                            new[]{ "national capital region","ncr","metro manila" }),
                        ("urban", 1.00m, "Provincial Cities & Urban Areas",
                            new[]{ "cebu","davao","iloilo","cagayan","laguna","cavite","rizal",
                                   "bulacan","pampanga","batangas","negros occidental","zamboanga" }),
                        ("rural", 0.88m, "Rural & Remote Areas", Array.Empty<string>()),
                    },
                    "ID" => new (string, decimal, string, string[])[]
                    {
                        ("prime", 1.12m, "Jabodetabek / Bali / Surabaya",
                            new[]{ "jakarta","bali" }),
                        ("urban", 1.00m, "Kota Besar Lainnya",
                            new[]{ "jawa","banten","yogyakarta","sumatera utara","sumatera selatan",
                                   "sulawesi selatan","kalimantan timur","kepulauan riau" }),
                        ("rural", 0.88m, "Kota Kecil & Pedesaan", Array.Empty<string>()),
                    },
                    "KH" => new (string, decimal, string, string[])[]
                    {
                        ("prime", 1.12m, "Phnom Penh / BKK / Daun Penh",
                            new[]{ "phnom penh" }),
                        ("urban", 1.00m, "Siem Reap / Sihanoukville / Other Cities",
                            new[]{ "siem reap","siemreap","preah sihanouk","sihanoukville","battambang" }),
                        ("rural", 0.88m, "Provincial & Rural Areas", Array.Empty<string>()),
                    },
                    _ => Array.Empty<(string, decimal, string, string[])>()
                };

                return tiers.Select(t => New<RateMultiplierConfig>(cfg =>
                {
                    cfg.Region          = region;
                    cfg.RegionConfigId  = regionConfigId;
                    cfg.Type            = "location_tier";
                    cfg.FactorKey       = t.Item1;
                    cfg.Multiplier      = t.Item2;
                    cfg.Label           = t.Item3;
                    cfg.KeywordsJson    = JsonSerializer.Serialize(t.Item4);
                })).ToList();
            }

            private static List<RateMultiplierConfig> BuildRiskMultipliers(string region, string regionConfigId)
            {
                var items = new List<RateMultiplierConfig>
                {
                    Risk(region, "base.premium",               500m,  "Fixed base amount before any multipliers (initial quote only)"),
                    Risk(region, "construction.full-brick",    1.00m, "Full-brick construction — base rate (no surcharge)"),
                    Risk(region, "construction.partial-brick", 1.30m, "Partial-brick construction — 30% surcharge"),
                    Risk(region, "storey.1",                   1.00m, "Single-storey property — base rate"),
                    Risk(region, "storey.2",                   1.10m, "Two-storey property — 10% surcharge"),
                    Risk(region, "storey.3plus",               1.20m, "Three or more storeys — 20% surcharge"),
                    Risk(region, "risk.flooding",              1.25m, "Property currently in a flood-prone area — 25% loading"),
                    Risk(region, "risk.unoccupied",            1.20m, "Unoccupied property — 20% loading"),
                    Risk(region, "risk.previous-loss",         1.15m, "Previous insurance loss on record — 15% loading"),
                    Risk(region, "age.1to10",                  1.00m, "Building age 1–10 years — no surcharge"),
                    Risk(region, "age.11to20",                 1.05m, "Building age 11–20 years — 5% surcharge"),
                    Risk(region, "age.21to30",                 1.10m, "Building age 21–30 years — 10% surcharge"),
                    Risk(region, "age.30plus",                 1.15m, "Building age 30+ years — 15% surcharge"),
                    Risk(region, "quality.low",                0.80m, "Low quality finishes — 20% reduction on build cost"),
                    Risk(region, "quality.standard",           1.00m, "Standard quality finishes — base rate"),
                    Risk(region, "quality.high",               1.25m, "High quality finishes — 25% surcharge"),
                    Risk(region, "topography.flat",            1.00m, "Flat topography — no surcharge"),
                    Risk(region, "topography.slope",           1.10m, "Sloped topography — 10% surcharge for foundation/grading"),
                    Risk(region, "site.normal",                1.00m, "Normal site access — no surcharge"),
                    Risk(region, "site.confined",              1.10m, "Confined site — 10% surcharge for restricted access"),
                    Risk(region, "site.city-centre",           1.15m, "City centre — 15% surcharge for logistics and access"),
                };
                items.ForEach(r => r.RegionConfigId = regionConfigId);
                return items;
            }

            private static List<AddOn> BuildAddOns() => new()
            {
                new AddOn { Code = "E008", Name = "Riot, Strike, Malicious Damage & Civil Commotion (RSMD)", EligiblePlanTypes = "1,2,3", SumInsuredBasis = "Building", RatesJson = """{"PH":0.0005,"ID":0.0005,"KH":0.0005}""" },
                new AddOn { Code = "E005", Name = "Extended Theft",                  EligiblePlanTypes = "2,3", SumInsuredBasis = "Content",  RatesJson = """{"PH":0.001,"ID":0.001,"KH":0.001}""" },
                new AddOn { Code = "E007", Name = "Alternative Accommodation",       EligiblePlanTypes = "2,3", SumInsuredBasis = "Content",  RatesJson = """{"PH":0.0003,"ID":0.0003,"KH":0.0003}""" },
                new AddOn { Code = "E006", Name = "Public Liability",                EligiblePlanTypes = "1,3", SumInsuredBasis = "Building", RatesJson = """{"PH":0.0002,"ID":0.0002,"KH":0.0002}""" },
            };

            private static RateMultiplierConfig Risk(string region, string key, decimal mul, string desc) =>
                New<RateMultiplierConfig>(r =>
                {
                    r.Region      = region;
                    r.Type        = "risk_factor";
                    r.FactorKey   = key;
                    r.Multiplier  = mul;
                    r.Description = desc;
                    r.Label       = desc;
                });

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
