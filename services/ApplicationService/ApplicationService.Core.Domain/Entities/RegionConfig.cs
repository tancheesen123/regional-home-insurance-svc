using ApplicationService.Core.Domain.Common;

namespace ApplicationService.Core.Domain.Entities
{
    public class RegionConfig : TransactionBaseEntity
    {
        public string Region { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public decimal BuildingRate { get; set; }
        public decimal ContentRate { get; set; }
        public decimal MinBuildingSum { get; set; }
        public decimal? MaxBuildingSum { get; set; }
        public decimal MinContentSum { get; set; }
        public decimal? MaxContentSum { get; set; }

        public decimal ServiceTaxRate { get; set; }
        public decimal StampDutyAmount { get; set; }
        public decimal StampDutyWaiverEligiblePremium { get; set; }

        public string AreaUnit { get; set; } = "sqm";
        public decimal AreaMin { get; set; }
        public decimal AreaMax { get; set; }
        public decimal StoreyIncrementPct { get; set; } = 0.05m;
        public int MaxStoreys { get; set; } = 5;
        public decimal ProfessionalFeeRate { get; set; } = 0.10m;
        public int BenchmarkYear { get; set; } = 2024;

        public string BuildingRatesJson { get; set; } = "[]";

        public string ValuableRatesJson { get; set; } = "[]";

        public ICollection<Quotation>           Quotations           { get; set; } = new List<Quotation>();
        public ICollection<RateConfigSnapshot>  RateConfigSnapshots  { get; set; } = new List<RateConfigSnapshot>();
        public ICollection<RateMultiplierConfig> RateMultiplierConfigs { get; set; } = new List<RateMultiplierConfig>();
    }
}
