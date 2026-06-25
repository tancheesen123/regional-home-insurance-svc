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
        public decimal BuildingRate       { get; set; }
        public decimal ContentRate        { get; set; }
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
        public decimal? BuildingRate        { get; set; }
        public decimal? ContentRate         { get; set; }
    }

    public class UpdateLocationTierRequest
    {
        public decimal?      Multiplier { get; set; }
        public string?       Label      { get; set; }
        public List<string>? Keywords   { get; set; }
    }


    public class UpdateLocationTierItem
    {
        public string        Id         { get; set; } = string.Empty;
        public decimal?      Multiplier { get; set; }
        public string?       Label      { get; set; }
        public List<string>? Keywords   { get; set; }
    }

    public class UpdateLocationTiersRequest
    {
        public List<UpdateLocationTierItem> Tiers { get; set; } = new();
    }

    public class UpdateLocationTiersResult
    {
        public int                   UpdatedCount { get; set; }
        public List<LocationTierDto> Updated      { get; set; } = new();
        public List<string>          Errors       { get; set; } = new();
    }


    public class UpdateRiskMultiplierRequest
    {
        public decimal  Multiplier  { get; set; }
        public string?  Description { get; set; }
    }

    public class UpdateRiskMultiplierItem
    {
        public string  Id          { get; set; } = string.Empty;
        public decimal Multiplier  { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateRiskMultipliersRequest
    {
        public List<UpdateRiskMultiplierItem> Multipliers { get; set; } = new();
    }

    public class UpdateRiskMultipliersResult
    {
        public int                      UpdatedCount { get; set; }
        public List<RiskMultiplierDto>  Updated      { get; set; } = new();
        public List<string>             Errors       { get; set; } = new();
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


    public class BuildingCostRequest
    {
        public string  PropertySubType  { get; set; } = string.Empty;
        public string  ConstructionType { get; set; } = string.Empty;
        public decimal FloorArea        { get; set; }
        public int     NumberOfStoreys  { get; set; } = 1;
        public string  Province         { get; set; } = string.Empty;

        public string  AgeOfBuilding    { get; set; } = "1to10";
        public string  Quality          { get; set; } = "standard";
        public string  Topography       { get; set; } = "flat";
        public string  SiteSurrounding  { get; set; } = "normal";

        public decimal FurnitureCost        { get; set; }
        public decimal FeaturesCost         { get; set; }
        public decimal ExternalRenovation   { get; set; }
        public decimal InternalRenovation   { get; set; }
        public decimal ImprovedFinishes     { get; set; }
    }

    public class BuildingCostResult
    {
        public string  PropertySubType      { get; set; } = string.Empty;
        public string  ConstructionType     { get; set; } = string.Empty;
        public decimal FloorArea            { get; set; }
        public string  AreaUnit             { get; set; } = string.Empty;
        public int     BenchmarkYear        { get; set; }

        public decimal BaseRatePerUnit      { get; set; }
        public decimal RawConstructionCost  { get; set; }

        public string  AgeOfBuilding        { get; set; } = string.Empty;
        public decimal AgeFactor            { get; set; }
        public string  Quality              { get; set; } = string.Empty;
        public decimal QualityMultiplier    { get; set; }
        public string  Topography           { get; set; } = string.Empty;
        public decimal TopographyFactor     { get; set; }
        public string  SiteSurrounding      { get; set; } = string.Empty;
        public decimal SiteFactor           { get; set; }
        public decimal ClassifiedCost       { get; set; }

        public int     NumberOfStoreys      { get; set; }
        public decimal StoreyIncrementPct   { get; set; }
        public decimal StoreyLoading        { get; set; }
        public decimal StoreyAdjustedCost   { get; set; }

        public string  DetectedLocationTier { get; set; } = string.Empty;
        public decimal LocationMultiplier   { get; set; }
        public decimal LocationAdjustedCost { get; set; }

        public decimal ProfessionalFeeRate  { get; set; }
        public decimal ProfessionalFee      { get; set; }

        public decimal FurnitureCost        { get; set; }
        public decimal FeaturesCost         { get; set; }
        public decimal ExternalRenovation   { get; set; }
        public decimal InternalRenovation   { get; set; }
        public decimal ImprovedFinishes     { get; set; }
        public decimal TotalAddOns          { get; set; }

        public decimal TotalRebuildingCost  { get; set; }
    }
}
