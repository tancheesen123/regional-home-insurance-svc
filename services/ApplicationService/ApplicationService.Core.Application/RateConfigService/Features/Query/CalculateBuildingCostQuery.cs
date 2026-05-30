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

                // ── Load config ───────────────────────────────────────────────
                var regionCfg = await _repo.GetRegionConfigAsync(region)
                    ?? throw new InvalidOperationException(
                        $"Rate configuration for region '{region}' has not been seeded yet. " +
                        "Call POST /api/rateconfig/seed first.");

                // ── Validate inputs ───────────────────────────────────────────
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

                // ── Look up base rate ─────────────────────────────────────────
                var allRates = await _repo.GetBuildingRatesAsync(region);
                var rateRow  = allRates.FirstOrDefault(r =>
                    r.PropertySubType.Equals(body.PropertySubType,   StringComparison.OrdinalIgnoreCase) &&
                    r.ConstructionType.Equals(body.ConstructionType,  StringComparison.OrdinalIgnoreCase))
                    ?? throw new KeyNotFoundException(
                        $"No rate found for '{body.PropertySubType}' / '{body.ConstructionType}' " +
                        $"in region '{region}'. " +
                        "Valid property types: bungalow, semi-detached, terrace, condo, apartment, flat. " +
                        "Valid construction types: full-brick, partial-brick.");

                // ── Load all risk multipliers for this region ─────────────────
                var allMultipliers = await _repo.GetRiskMultipliersAsync(region);

                // ── Look up the 4 classification factors ──────────────────────
                var ageFactor        = LookupFactor(allMultipliers, $"age.{body.AgeOfBuilding}",
                    "age", "1to10 | 11to20 | 21to30 | 30plus");

                var qualityFactor    = LookupFactor(allMultipliers, $"quality.{body.Quality}",
                    "quality", "low | standard | high");

                var topographyFactor = LookupFactor(allMultipliers, $"topography.{body.Topography}",
                    "topography", "flat | slope");

                var siteFactor       = LookupFactor(allMultipliers, $"site.{body.SiteSurrounding}",
                    "siteSurrounding", "normal | confined | city-centre");

                // ── Detect location tier from province ────────────────────────
                var tiers = await _repo.GetLocationTiersAsync(region);
                var (detectedTier, locationMultiplier) = DetectTier(body.Province, tiers);

                // ═════════════════════════════════════════════════════════════
                // FORMULA
                // ═════════════════════════════════════════════════════════════

                // Step 1a — Raw construction cost
                var rawCost = Round(body.FloorArea * rateRow.RatePerUnit);

                // Step 1b — Classification modifiers (quality × age × topography × site)
                var classifiedCost = Round(rawCost
                    * qualityFactor
                    * ageFactor
                    * topographyFactor
                    * siteFactor);

                // Step 2 — Storey loading (applied on classified cost, before location)
                var storeyLoadingPct  = (body.NumberOfStoreys - 1) * regionCfg.StoreyIncrementPct;
                var storeyLoading     = Round(classifiedCost * storeyLoadingPct);
                var storeyAdjusted    = classifiedCost + storeyLoading;

                // Step 3 — Location adjustment
                var locationAdjusted  = Round(storeyAdjusted * locationMultiplier);

                // Step 4 — Professional fee (on location-adjusted amount)
                var professionalFee   = Round(locationAdjusted * regionCfg.ProfessionalFeeRate);

                // Step 5 — Add-ons (direct additions, no multiplier)
                var furnitureCost       = Clamp(body.FurnitureCost);
                var featuresCost        = Clamp(body.FeaturesCost);
                var externalRenovation  = Clamp(body.ExternalRenovation);
                var internalRenovation  = Clamp(body.InternalRenovation);
                var improvedFinishes    = Clamp(body.ImprovedFinishes);
                var totalAddOns         = furnitureCost + featuresCost
                                        + externalRenovation + internalRenovation
                                        + improvedFinishes;

                // Step 6 — Total rebuilding cost
                var total = Round(locationAdjusted + professionalFee + totalAddOns);

                // ═════════════════════════════════════════════════════════════
                // BUILD RESULT
                // ═════════════════════════════════════════════════════════════
                return new BuildingCostResult
                {
                    // Inputs echoed
                    PropertySubType      = rateRow.PropertySubType,
                    ConstructionType     = rateRow.ConstructionType,
                    FloorArea            = body.FloorArea,
                    AreaUnit             = regionCfg.AreaUnit,
                    BenchmarkYear        = regionCfg.BenchmarkYear,

                    // Step 1a
                    BaseRatePerUnit      = rateRow.RatePerUnit,
                    RawConstructionCost  = rawCost,

                    // Step 1b
                    AgeOfBuilding        = body.AgeOfBuilding,
                    AgeFactor            = ageFactor,
                    Quality              = body.Quality,
                    QualityMultiplier    = qualityFactor,
                    Topography           = body.Topography,
                    TopographyFactor     = topographyFactor,
                    SiteSurrounding      = body.SiteSurrounding,
                    SiteFactor           = siteFactor,
                    ClassifiedCost       = classifiedCost,

                    // Step 2
                    NumberOfStoreys      = body.NumberOfStoreys,
                    StoreyIncrementPct   = regionCfg.StoreyIncrementPct,
                    StoreyLoading        = storeyLoading,
                    StoreyAdjustedCost   = storeyAdjusted,

                    // Step 3
                    DetectedLocationTier = detectedTier,
                    LocationMultiplier   = locationMultiplier,
                    LocationAdjustedCost = locationAdjusted,

                    // Step 4
                    ProfessionalFeeRate  = regionCfg.ProfessionalFeeRate,
                    ProfessionalFee      = professionalFee,

                    // Step 5
                    FurnitureCost        = furnitureCost,
                    FeaturesCost         = featuresCost,
                    ExternalRenovation   = externalRenovation,
                    InternalRenovation   = internalRenovation,
                    ImprovedFinishes     = improvedFinishes,
                    TotalAddOns          = totalAddOns,

                    // Step 6
                    TotalRebuildingCost  = total,
                };
            }

            // ── Helpers ───────────────────────────────────────────────────────

            /// <summary>
            /// Looks up a factor key in the loaded multipliers list.
            /// Throws a descriptive ArgumentException if the key is not found
            /// (likely means the value passed for that field is invalid).
            /// </summary>
            private static decimal LookupFactor(
                List<RiskMultiplierConfig> all, string key,
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

            /// <summary>
            /// Matches province string against each tier's keyword list.
            /// Strategy: provinceInput.Contains(keyword) — case-insensitive.
            /// If multiple tiers match, picks the highest multiplier.
            /// Fallback: urban tier.
            /// </summary>
            private static (string tier, decimal multiplier) DetectTier(
                string province, List<LocationTierConfig> tiers)
            {
                if (string.IsNullOrWhiteSpace(province))
                    return FallbackUrban(tiers);

                var provinceNorm = province.Trim().ToLower();
                LocationTierConfig? best = null;

                foreach (var tier in tiers)
                {
                    List<string> keywords;
                    try { keywords = JsonSerializer.Deserialize<List<string>>(tier.KeywordsJson) ?? new(); }
                    catch   { keywords = new(); }

                    if (keywords.Any(kw => provinceNorm.Contains(kw.ToLower(), StringComparison.Ordinal)))
                    {
                        if (best == null || tier.Multiplier > best.Multiplier)
                            best = tier;
                    }
                }

                return best != null ? (best.Tier, best.Multiplier) : FallbackUrban(tiers);
            }

            private static (string, decimal) FallbackUrban(List<LocationTierConfig> tiers)
            {
                var urban = tiers.FirstOrDefault(t =>
                    t.Tier.Equals("urban", StringComparison.OrdinalIgnoreCase));
                return urban != null ? (urban.Tier, urban.Multiplier) : ("urban", 1.00m);
            }

            private static decimal Round(decimal value) =>
                Math.Round(value, 2, MidpointRounding.AwayFromZero);

            /// <summary>Clamps add-on amounts to 0 minimum — negative values are ignored.</summary>
            private static decimal Clamp(decimal value) => value < 0 ? 0m : value;
        }
    }
}
