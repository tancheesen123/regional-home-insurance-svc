namespace ApplicationService.Core.Application.RateConfigService.DTOs
{
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
        public Dictionary<string, LocationTierDetail> LocationTiers { get; set; } = new();
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

    public class UpdateBuildingRateItem
    {
        public string  Id          { get; set; } = string.Empty;
        public decimal RatePerUnit { get; set; }
    }

    public class UpdateBuildingRatesRequest
    {
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
        public List<string>? Keywords   { get; set; }
    }

    public class UpdateRiskMultiplierRequest
    {
        public decimal  Multiplier  { get; set; }
        public string?  Description { get; set; }
    }
    public class RateConfigSnapshotDto
    {
        public string   Id           { get; set; } = string.Empty;
        public string   Region       { get; set; } = string.Empty;
        public string   Label        { get; set; } = string.Empty;
        public string   SnapshotType { get; set; } = string.Empty;
        public string   CreatedBy    { get; set; } = string.Empty;
        public DateTime CreatedAt    { get; set; }
        public List<RateConfigChangeLogDto> ChangeLogs { get; set; } = new();
    }

    public class RateConfigChangeLogDto
    {
        public string   Id        { get; set; } = string.Empty;
        public string   TableName { get; set; } = string.Empty;
        public string   RecordId  { get; set; } = string.Empty;
        public string   FieldName { get; set; } = string.Empty;
        public string   OldValue  { get; set; } = string.Empty;
        public string   NewValue  { get; set; } = string.Empty;
        public string   ChangedBy { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
    }

    public class RestoreSnapshotRequest
    {
        public string? Note { get; set; }
    }
}
