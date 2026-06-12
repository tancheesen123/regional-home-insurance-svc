using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using MediatR;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Query
{
    // ── Admin dashboard: returns all raw config rows for a region ─────────────

    public class GetRateConfigsQuery : IRequest<GetRateConfigsResult>
    {
        public string Region { get; set; } = string.Empty;

        public class Handler : IRequestHandler<GetRateConfigsQuery, GetRateConfigsResult>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<GetRateConfigsResult> Handle(
                GetRateConfigsQuery request, CancellationToken cancellationToken)
            {
                var region = request.Region.ToUpper();

                var regionConfig    = await _repo.GetRegionConfigAsync(region);
                var locationTiers   = await _repo.GetMultipliersAsync(region, "location_tier");
                var riskMultipliers = await _repo.GetMultipliersAsync(region, "risk_factor");

                // Building rates come from RegionConfig.BuildingRatesJson
                var buildingRates = regionConfig == null
                    ? new List<BuildingRateDto>()
                    : ParseBuildingRates(regionConfig.BuildingRatesJson, region);

                return new GetRateConfigsResult
                {
                    BuildingRates = buildingRates,

                    RegionConfig = regionConfig == null ? null : new RegionRateConfigDto
                    {
                        Id                  = regionConfig.Id,
                        Region              = regionConfig.Region,
                        AreaUnit            = regionConfig.AreaUnit,
                        AreaMin             = regionConfig.AreaMin,
                        AreaMax             = regionConfig.AreaMax,
                        StoreyIncrementPct  = regionConfig.StoreyIncrementPct,
                        MaxStoreys          = regionConfig.MaxStoreys,
                        ProfessionalFeeRate = regionConfig.ProfessionalFeeRate,
                        BenchmarkYear       = regionConfig.BenchmarkYear,
                        BuildingRate        = regionConfig.BuildingRate,
                        ContentRate         = regionConfig.ContentRate,
                        IsActive            = regionConfig.IsActive,
                    },

                    LocationTiers = locationTiers.Select(t => new LocationTierDto
                    {
                        Id         = t.Id,
                        Region     = t.Region,
                        Tier       = t.FactorKey,
                        Multiplier = t.Multiplier,
                        Label      = t.Label,
                        Keywords   = ParseKeywords(t.KeywordsJson),
                        IsActive   = t.IsActive,
                    }).ToList(),

                    RiskMultipliers = riskMultipliers.Select(m => new RiskMultiplierDto
                    {
                        Id          = m.Id,
                        Region      = m.Region,
                        FactorKey   = m.FactorKey,
                        Multiplier  = m.Multiplier,
                        Description = m.Description,
                        IsActive    = m.IsActive,
                    }).ToList(),
                };
            }

            private static List<string> ParseKeywords(string? json)
            {
                if (string.IsNullOrWhiteSpace(json)) return new();
                try { return JsonSerializer.Deserialize<List<string>>(json) ?? new(); }
                catch { return new(); }
            }

            private static List<BuildingRateDto> ParseBuildingRates(string json, string region)
            {
                try
                {
                    var rows = JsonSerializer.Deserialize<List<BuildingRateRow>>(json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
                    return rows.Select(r => new BuildingRateDto
                    {
                        Id               = r.Id,
                        Region           = region,
                        PropertySubType  = r.PropertySubType,
                        ConstructionType = r.ConstructionType,
                        RatePerUnit      = r.RatePerUnit,
                        IsActive         = r.IsActive,
                    }).ToList();
                }
                catch { return new(); }
            }

            private class BuildingRateRow
            {
                public string  Id               { get; set; } = string.Empty;
                public string  PropertySubType  { get; set; } = string.Empty;
                public string  ConstructionType { get; set; } = string.Empty;
                public decimal RatePerUnit      { get; set; }
                public bool    IsActive         { get; set; } = true;
            }
        }
    }

    public class GetRateConfigsResult
    {
        public List<BuildingRateDto>    BuildingRates   { get; set; } = new();
        public RegionRateConfigDto?     RegionConfig    { get; set; }
        public List<LocationTierDto>    LocationTiers   { get; set; } = new();
        public List<RiskMultiplierDto>  RiskMultipliers { get; set; } = new();
    }

    // ── Frontend-shaped config: replaces hardcoded BUILDING_CONFIGS ────────────

    public class GetBuildingConfigQuery : IRequest<BuildingConfigResponse>
    {
        public string Region { get; set; } = string.Empty;

        public class Handler : IRequestHandler<GetBuildingConfigQuery, BuildingConfigResponse>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<BuildingConfigResponse> Handle(
                GetBuildingConfigQuery request, CancellationToken cancellationToken)
            {
                var region = request.Region.ToUpper();

                var regionConfig = await _repo.GetRegionConfigAsync(region)
                    ?? throw new InvalidOperationException(
                        $"No rate configuration found for region '{region}'. Please seed the data first.");

                var locationTiers = await _repo.GetMultipliersAsync(region, "location_tier");

                // Building rates come from RegionConfig.BuildingRatesJson
                var buildingRates = ParseBuildingRates(regionConfig.BuildingRatesJson);

                var ratesDict = buildingRates
                    .GroupBy(r => r.PropertySubType.ToLower())
                    .ToDictionary(
                        g => g.Key,
                        g => new ConstructionRateDetail
                        {
                            FullBrick    = g.FirstOrDefault(r =>
                                r.ConstructionType.Equals("full-brick", StringComparison.OrdinalIgnoreCase))?.RatePerUnit ?? 0m,
                            PartialBrick = g.FirstOrDefault(r =>
                                r.ConstructionType.Equals("partial-brick", StringComparison.OrdinalIgnoreCase))?.RatePerUnit ?? 0m,
                        });

                var tiersDict = locationTiers.ToDictionary(
                    t => t.FactorKey.ToLower(),
                    t => new LocationTierDetail
                    {
                        Multiplier = t.Multiplier,
                        Label      = t.Label,
                        Keywords   = ParseKeywords(t.KeywordsJson),
                    });

                return new BuildingConfigResponse
                {
                    CountryCode         = region,
                    AreaUnit            = regionConfig.AreaUnit,
                    AreaMin             = regionConfig.AreaMin,
                    AreaMax             = regionConfig.AreaMax,
                    StoreyIncrementPct  = regionConfig.StoreyIncrementPct,
                    MaxStoreys          = regionConfig.MaxStoreys,
                    ProfessionalFeeRate = regionConfig.ProfessionalFeeRate,
                    BenchmarkYear       = regionConfig.BenchmarkYear,
                    LocationTiers       = tiersDict,
                    Rates               = ratesDict,
                };
            }

            private static List<string> ParseKeywords(string? json)
            {
                if (string.IsNullOrWhiteSpace(json)) return new();
                try { return JsonSerializer.Deserialize<List<string>>(json) ?? new(); }
                catch { return new(); }
            }

            private static List<BuildingRateRow> ParseBuildingRates(string json)
            {
                try { return JsonSerializer.Deserialize<List<BuildingRateRow>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new(); }
                catch { return new(); }
            }

            private class BuildingRateRow
            {
                public string  PropertySubType  { get; set; } = string.Empty;
                public string  ConstructionType { get; set; } = string.Empty;
                public decimal RatePerUnit      { get; set; }
            }
        }
    }
}
