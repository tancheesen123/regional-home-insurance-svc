namespace ApplicationService.Core.Application.RateConfigService.DTOs
{
    // ── Read DTOs ─────────────────────────────────────────────────────────────

    public class BuildingRateDto
    {
        public string  Id               { get; set; } = string.Empty;
        public string  Region           { get; set; } = string.Empty;
        public string  PropertySubType  { get; set; } = string.Empty;
        public string  ConstructionType { get; set; } = string.Empty;
        public decimal RatePerUnit      { get; set; }
        public bool    IsActive         { get; set; }
    }

    public class RegionRateConfigDto
    {
        public string  Id                 { get; set; } = string.Empty;
        public string  Region             { get; set; } = string.Empty;
        public string  AreaUnit           { get; set; } = string.Empty;
        public decimal AreaMin            { get; set; }
        public decimal AreaMax            { get; set; }
        public decimal StoreyIncrementPct { get; set; }
        public int     MaxStoreys         { get; set; }
        public decimal ProfessionalFeeRate{ get; set; }
        public int     BenchmarkYear      { get; set; }
        public bool    IsActive           { get; set; }
    }

    public class LocationTierDto
    {
        public string  Id           { get; set; } = string.Empty;
        public string  Region       { get; set; } = string.Empty;
        public string  Tier         { get; set; } = string.Empty;
        public decimal Multiplier   { get; set; }
        public string  Label        { get; set; } = string.Empty;
        /// <summary>Parsed list of keywords (deserialized from KeywordsJson).</summary>
        public List<string> Keywords { get; set; } = new();
        public bool    IsActive     { get; set; }
    }

    public class RiskMultiplierDto
    {
        public string  Id          { get; set; } = string.Empty;
        public string  Region      { get; set; } = string.Empty;
        public string  FactorKey   { get; set; } = string.Empty;
        public decimal Multiplier  { get; set; }
        public string? Description { get; set; }
        public bool    IsActive    { get; set; }
    }

    // ── Full building-config response (shaped for the frontend) ───────────────

    /// <summary>
    /// Full region config in the shape the frontend expects.
    /// Replaces the static BUILDING_CONFIGS object in building-rates.ts.
    /// </summary>
    public class BuildingConfigResponse
    {
        public string  CountryCode        { get; set; } = string.Empty;
        public string  AreaUnit           { get; set; } = string.Empty;
        public decimal AreaMin            { get; set; }
        public decimal AreaMax            { get; set; }
        public decimal StoreyIncrementPct { get; set; }
        public int     MaxStoreys         { get; set; }
        public decimal ProfessionalFeeRate{ get; set; }
        public int     BenchmarkYear      { get; set; }

        /// <summary>prime | urban | rural → { multiplier, label, keywords }</summary>
        public Dictionary<string, LocationTierDetail> LocationTiers { get; set; } = new();

        /// <summary>propertySubType → { fullBrick, partialBrick }</summary>
        public Dictionary<string, ConstructionRateDetail> Rates { get; set; } = new();
    }

    public class LocationTierDetail
    {
        public decimal      Multiplier { get; set; }
        public string       Label      { get; set; } = string.Empty;
        public List<string> Keywords   { get; set; } = new();
    }

    public class ConstructionRateDetail
    {
        public decimal FullBrick    { get; set; }
        public decimal PartialBrick { get; set; }
    }

    // ── Update request bodies ─────────────────────────────────────────────────

    /// <summary>One item in a bulk building-rate update.</summary>
    public class UpdateBuildingRateItem
    {
        /// <summary>Id of the BuildingConstructionRate row to update.</summary>
        public string  Id          { get; set; } = string.Empty;
        /// <summary>New rate per area unit in local currency. Must be > 0.</summary>
        public decimal RatePerUnit { get; set; }
    }

    public class UpdateBuildingRatesRequest
    {
        /// <summary>One or more rows to update in a single call.</summary>
        public List<UpdateBuildingRateItem> Rates { get; set; } = new();
    }

    public class UpdateRegionConfigRequest
    {
        public string?  AreaUnit            { get; set; }
        public decimal? AreaMin             { get; set; }
        public decimal? AreaMax             { get; set; }
        public decimal? StoreyIncrementPct  { get; set; }
        public int?     MaxStoreys          { get; set; }
        public decimal? ProfessionalFeeRate { get; set; }
        public int?     BenchmarkYear       { get; set; }
    }

    public class UpdateLocationTierRequest
    {
        public decimal?      Multiplier { get; set; }
        public string?       Label      { get; set; }
        /// <summary>Full replacement list of province keywords.</summary>
        public List<string>? Keywords   { get; set; }
    }

    public class UpdateRiskMultiplierRequest
    {
        public decimal  Multiplier  { get; set; }
        public string?  Description { get; set; }
    }
}
