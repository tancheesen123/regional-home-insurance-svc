using ApplicationService.Core.Application.RateConfigService.DTOs;
using ApplicationService.Core.Application.RateConfigService.Interfaces.Repositories;
using ApplicationService.Core.Domain.Entities;
using MediatR;
using System.Text.Json;

namespace ApplicationService.Core.Application.RateConfigService.Features.Query
{
    public class CalculateBuildingCostQuery : IRequest<BuildingCostResult>
    {
        public string             Region { get; set; } = string.Empty;
        public BuildingCostRequest Body  { get; set; } = new();

        public class Handler : IRequestHandler<CalculateBuildingCostQuery, BuildingCostResult>
        {
            private readonly IRateConfigRepository _repo;
            public Handler(IRateConfigRepository repo) => _repo = repo;

            public async Task<BuildingCostResult> Handle(
                CalculateBuildingCostQuery request, CancellationToken ct)
            {
                var region = request.Region.ToUpper();
                var body   = request.Body;

                var regionCfg = await _repo.GetRegionConfigAsync(region)
                    ?? throw new InvalidOperationException(
                        $"Rate configuration for region '{region}' has not been seeded yet. " +
                        "Call POST /api/rateconfig/seed first.");

                if (body.FloorArea <= 0)
                    throw new ArgumentException("Floor area must be greater than zero.");

                if (body.FloorArea < regionCfg.AreaMin)
                    throw new ArgumentException(
                        $"Floor area ({body.FloorArea} {regionCfg.AreaUnit}) is below the minimum " +
                        $"of {regionCfg.AreaMin} {regionCfg.AreaUnit}.");

                if (body.FloorArea > regionCfg.AreaMax)
                    throw new ArgumentException(
                        $"Floor area ({body.FloorArea} {regionCfg.AreaUnit}) exceeds the maximum " +
                        $"of {regionCfg.AreaMax} {regionCfg.AreaUnit}.");

                if (body.NumberOfStoreys < 1)
                    throw new ArgumentException("Number of storeys must be at least 1.");

                if (body.NumberOfStoreys > regionCfg.MaxStoreys)
                    throw new ArgumentException(
                        $"Number of storeys ({body.NumberOfStoreys}) exceeds the regional " +
                        $"maximum of {regionCfg.MaxStoreys}.");

                var buildingRates = ParseBuildingRates(regionCfg.BuildingRatesJson);
                var rateRow = buildingRates.FirstOrDefault(r =>
                    r.PropertySubType.Equals(body.PropertySubType,  StringComparison.OrdinalIgnoreCase) &&
                    r.ConstructionType.Equals(body.ConstructionType, StringComparison.OrdinalIgnoreCase))
                    ?? throw new KeyNotFoundException(
                        $"No rate found for '{body.PropertySubType}' / '{body.ConstructionType}' in region '{region}'. " +
                        "Valid property types: bungalow, semi-detached, terrace, condo, apartment, flat. " +
                        "Valid construction types: full-brick, partial-brick.");

                var allMultipliers = await _repo.GetMultipliersAsync(region, "risk_factor");

                var ageFactor        = LookupFactor(allMultipliers, $"age.{body.AgeOfBuilding}",
                    "age", "1to10 | 11to20 | 21to30 | 30plus");

                var qualityFactor    = LookupFactor(allMultipliers, $"quality.{body.Quality}",
                    "quality", "low | standard | high");

                var topographyFactor = LookupFactor(allMultipliers, $"topography.{body.Topography}",
                    "topography", "flat | slope");

                var siteFactor       = LookupFactor(allMultipliers, $"site.{body.SiteSurrounding}",
                    "siteSurrounding", "normal | confined | city-centre");

                var tiers = await _repo.GetMultipliersAsync(region, "location_tier");
                var (detectedTier, locationMultiplier) = DetectTier(body.Province, tiers);


                var rawCost = Round(body.FloorArea * rateRow.RatePerUnit);

                var classifiedCost = Round(rawCost
                    * qualityFactor
                    * ageFactor
                    * topographyFactor
                    * siteFactor);

                var storeyLoadingPct  = (body.NumberOfStoreys - 1) * regionCfg.StoreyIncrementPct;
                var storeyLoading     = Round(classifiedCost * storeyLoadingPct);
                var storeyAdjusted    = classifiedCost + storeyLoading;

                var locationAdjusted  = Round(storeyAdjusted * locationMultiplier);

                var professionalFee   = Round(locationAdjusted * regionCfg.ProfessionalFeeRate);

                var furnitureCost       = Clamp(body.FurnitureCost);
                var featuresCost        = Clamp(body.FeaturesCost);
                var externalRenovation  = Clamp(body.ExternalRenovation);
                var internalRenovation  = Clamp(body.InternalRenovation);
                var improvedFinishes    = Clamp(body.ImprovedFinishes);
                var totalAddOns         = furnitureCost + featuresCost
                                        + externalRenovation + internalRenovation
                                        + improvedFinishes;

                var total = Round(locationAdjusted + professionalFee + totalAddOns);

                return new BuildingCostResult
                {
                    PropertySubType      = rateRow.PropertySubType,
                    ConstructionType     = rateRow.ConstructionType,
                    FloorArea            = body.FloorArea,
                    AreaUnit             = regionCfg.AreaUnit,
                    BenchmarkYear        = regionCfg.BenchmarkYear,

                    BaseRatePerUnit      = rateRow.RatePerUnit,
                    RawConstructionCost  = rawCost,

                    AgeOfBuilding        = body.AgeOfBuilding,
                    AgeFactor            = ageFactor,
                    Quality              = body.Quality,
                    QualityMultiplier    = qualityFactor,
                    Topography           = body.Topography,
                    TopographyFactor     = topographyFactor,
                    SiteSurrounding      = body.SiteSurrounding,
                    SiteFactor           = siteFactor,
                    ClassifiedCost       = classifiedCost,

                    NumberOfStoreys      = body.NumberOfStoreys,
                    StoreyIncrementPct   = regionCfg.StoreyIncrementPct,
                    StoreyLoading        = storeyLoading,
                    StoreyAdjustedCost   = storeyAdjusted,

                    DetectedLocationTier = detectedTier,
                    LocationMultiplier   = locationMultiplier,
                    LocationAdjustedCost = locationAdjusted,

                    ProfessionalFeeRate  = regionCfg.ProfessionalFeeRate,
                    ProfessionalFee      = professionalFee,

                    FurnitureCost        = furnitureCost,
                    FeaturesCost         = featuresCost,
                    ExternalRenovation   = externalRenovation,
                    InternalRenovation   = internalRenovation,
                    ImprovedFinishes     = improvedFinishes,
                    TotalAddOns          = totalAddOns,

                    TotalRebuildingCost  = total,
                };
            }


            private static decimal LookupFactor(
                List<RateMultiplierConfig> all, string key,
                string fieldName, string validValues)
            {
                var row = all.FirstOrDefault(m =>
                    m.FactorKey.Equals(key, StringComparison.OrdinalIgnoreCase));

                if (row == null)
                    throw new ArgumentException(
                        $"Invalid value for '{fieldName}': '{key.Split('.').Last()}'. " +
                        $"Valid values are: {validValues}. " +
                        "If you believe this is a configuration issue, ask an admin to check the seeded risk multipliers.");

                return row.Multiplier;
            }

            private static (string tier, decimal multiplier) DetectTier(
                string province, List<RateMultiplierConfig> tiers)
            {
                if (string.IsNullOrWhiteSpace(province))
                    return FallbackUrban(tiers);

                var provinceNorm = province.Trim().ToLower();
                RateMultiplierConfig? best = null;

                foreach (var tier in tiers)
                {
                    List<string> keywords;
                    try { keywords = JsonSerializer.Deserialize<List<string>>(tier.KeywordsJson ?? "[]") ?? new(); }
                    catch { keywords = new(); }

                    if (keywords.Any(kw => provinceNorm.Contains(kw.ToLower(), StringComparison.Ordinal)))
                    {
                        if (best == null || tier.Multiplier > best.Multiplier)
                            best = tier;
                    }
                }

                return best != null ? (best.FactorKey, best.Multiplier) : FallbackUrban(tiers);
            }

            private static (string, decimal) FallbackUrban(List<RateMultiplierConfig> tiers)
            {
                var urban = tiers.FirstOrDefault(t =>
                    t.FactorKey.Equals("urban", StringComparison.OrdinalIgnoreCase));
                return urban != null ? (urban.FactorKey, urban.Multiplier) : ("urban", 1.00m);
            }

            private static List<BuildingRateRow> ParseBuildingRates(string json)
            {
                try { return JsonSerializer.Deserialize<List<BuildingRateRow>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new(); }
                catch { return new(); }
            }

            private sealed class BuildingRateRow
            {
                public string  Id               { get; set; } = string.Empty;
                public string  PropertySubType  { get; set; } = string.Empty;
                public string  ConstructionType { get; set; } = string.Empty;
                public decimal RatePerUnit      { get; set; }
                public bool    IsActive         { get; set; } = true;
            }

            private static decimal Round(decimal value) =>
                Math.Round(value, 2, MidpointRounding.AwayFromZero);

            private static decimal Clamp(decimal value) => value < 0 ? 0m : value;
        }
    }
}
