using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.IDApplicationDb
{
    public partial class SimplifySchema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<string>("AddressLine1", "Customers", "nvarchar(100)", maxLength: 100, nullable: true);
            migrationBuilder.AddColumn<string>("AddressLine2", "Customers", "nvarchar(100)", maxLength: 100, nullable: true);
            migrationBuilder.AddColumn<string>("City",         "Customers", "nvarchar(100)", maxLength: 100, nullable: true);
            migrationBuilder.AddColumn<string>("Country",      "Customers", "nvarchar(100)", maxLength: 100, nullable: true);
            migrationBuilder.AddColumn<string>("Postcode",     "Customers", "nvarchar(10)",  maxLength: 10,  nullable: true);
            migrationBuilder.AddColumn<string>("State",        "Customers", "nvarchar(100)", maxLength: 100, nullable: true);

            migrationBuilder.AddColumn<decimal>("PlanPremium",        "Quotations", "decimal(18,2)", nullable: true);
            migrationBuilder.AddColumn<decimal>("AddOnPremium",       "Quotations", "decimal(18,2)", nullable: true);
            migrationBuilder.AddColumn<decimal>("GrossPremium",       "Quotations", "decimal(18,2)", nullable: true);
            migrationBuilder.AddColumn<decimal>("DiscountAmount",     "Quotations", "decimal(18,2)", nullable: true);
            migrationBuilder.AddColumn<decimal>("NetPremium",         "Quotations", "decimal(18,2)", nullable: true);
            migrationBuilder.AddColumn<decimal>("TaxRate",            "Quotations", "decimal(5,2)",  nullable: true);
            migrationBuilder.AddColumn<decimal>("TaxAmount",          "Quotations", "decimal(18,2)", nullable: true);
            migrationBuilder.AddColumn<decimal>("StampDuty",          "Quotations", "decimal(18,2)", nullable: true);
            migrationBuilder.AddColumn<decimal>("TotalBeforeDiscount","Quotations", "decimal(18,2)", nullable: true);
            migrationBuilder.AddColumn<string> ("ValuableItemsJson",  "Quotations", "TEXT", nullable: true);

            migrationBuilder.AddColumn<string>("DocumentsJson", "Policies", "TEXT", nullable: true);

            migrationBuilder.AddColumn<string>("RatesJson", "AddOns", "TEXT", nullable: false, defaultValue: "{}");

            migrationBuilder.AddColumn<string>("ChangeLogsJson", "RateConfigSnapshots", "TEXT", nullable: false, defaultValue: "[]");


            migrationBuilder.CreateTable(
                name: "RegionConfigs",
                columns: table => new
                {
                    Id                             = table.Column<string> (type: "nvarchar(50)",  maxLength: 50,  nullable: false),
                    Region                         = table.Column<string> (type: "nvarchar(2)",   maxLength: 2,   nullable: false),
                    IsActive                       = table.Column<bool>   (type: "bit",           nullable: false, defaultValue: true),
                    BuildingRate                   = table.Column<decimal>(type: "decimal(10,6)", nullable: false),
                    ContentRate                    = table.Column<decimal>(type: "decimal(10,6)", nullable: false),
                    MinBuildingSum                 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxBuildingSum                 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MinContentSum                  = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxContentSum                  = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ServiceTaxRate                 = table.Column<decimal>(type: "decimal(5,2)",  nullable: false),
                    StampDutyAmount                = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StampDutyWaiverEligiblePremium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AreaUnit                       = table.Column<string> (type: "nvarchar(5)",   maxLength: 5,   nullable: false),
                    AreaMin                        = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    AreaMax                        = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    StoreyIncrementPct             = table.Column<decimal>(type: "decimal(5,4)",  nullable: false),
                    MaxStoreys                     = table.Column<int>    (type: "int",           nullable: false),
                    ProfessionalFeeRate            = table.Column<decimal>(type: "decimal(5,4)",  nullable: false),
                    BenchmarkYear                  = table.Column<int>    (type: "int",           nullable: false),
                    BuildingRatesJson              = table.Column<string> (type: "TEXT",          nullable: false, defaultValue: "[]"),
                    ValuableRatesJson              = table.Column<string> (type: "TEXT",          nullable: false, defaultValue: "[]"),
                    CreatedAt                      = table.Column<DateTime>(type: "datetime2",    nullable: false),
                    UpdatedAt                      = table.Column<DateTime>(type: "datetime2",    nullable: true),
                    CreatedBy                      = table.Column<string> (type: "nvarchar(50)",  maxLength: 50,  nullable: true),
                    UpdatedBy                      = table.Column<string> (type: "nvarchar(50)",  maxLength: 50,  nullable: true)
                },
                constraints: table => table.PrimaryKey("PK_RegionConfigs", x => x.Id));

            migrationBuilder.CreateTable(
                name: "RateMultiplierConfigs",
                columns: table => new
                {
                    Id           = table.Column<string> (type: "nvarchar(50)",  maxLength: 50,  nullable: false),
                    Region       = table.Column<string> (type: "nvarchar(5)",   maxLength: 5,   nullable: false),
                    Type         = table.Column<string> (type: "nvarchar(20)",  maxLength: 20,  nullable: false),
                    FactorKey    = table.Column<string> (type: "nvarchar(50)",  maxLength: 50,  nullable: false),
                    Multiplier   = table.Column<decimal>(type: "decimal(10,4)", nullable: false),
                    Label        = table.Column<string> (type: "nvarchar(200)", maxLength: 200, nullable: false),
                    KeywordsJson = table.Column<string> (type: "TEXT",          nullable: true),
                    Description  = table.Column<string> (type: "TEXT",          nullable: true),
                    IsActive     = table.Column<bool>   (type: "bit",           nullable: false, defaultValue: true),
                    CreatedAt    = table.Column<DateTime>(type: "datetime2",    nullable: false),
                    UpdatedAt    = table.Column<DateTime>(type: "datetime2",    nullable: true),
                    CreatedBy    = table.Column<string> (type: "nvarchar(50)",  maxLength: 50,  nullable: true),
                    UpdatedBy    = table.Column<string> (type: "nvarchar(50)",  maxLength: 50,  nullable: true)
                },
                constraints: table => table.PrimaryKey("PK_RateMultiplierConfigs", x => x.Id));

            migrationBuilder.CreateIndex("IX_RegionConfigs_Region_IsActive",                  "RegionConfigs",        new[] { "Region", "IsActive" });
            migrationBuilder.CreateIndex("IX_RateMultiplierConfigs_Region_Type_FactorKey_IsActive", "RateMultiplierConfigs", new[] { "Region", "Type", "FactorKey", "IsActive" });


            migrationBuilder.Sql(@"
                UPDATE c SET
                    c.AddressLine1 = a.AddressLine1,
                    c.AddressLine2 = a.AddressLine2,
                    c.City         = a.City,
                    c.Postcode     = a.Postcode,
                    c.State        = a.State,
                    c.Country      = a.Country
                FROM Customers c
                INNER JOIN Addresses a ON c.AddressId = a.Id
            ");

            migrationBuilder.Sql(@"
                UPDATE q SET
                    q.PlanPremium         = qp.PlanPremium,
                    q.AddOnPremium        = qp.AddOnPremium,
                    q.GrossPremium        = qp.GrossPremium,
                    q.DiscountAmount      = qp.DiscountAmount,
                    q.NetPremium          = qp.NetPremium,
                    q.TaxRate             = qp.TaxRate,
                    q.TaxAmount           = qp.TaxAmount,
                    q.StampDuty           = qp.StampDuty,
                    q.TotalBeforeDiscount = qp.TotalBeforeDiscount
                FROM Quotations q
                INNER JOIN QuotationPremiums qp ON q.QuotationId = qp.QuotationId
            ");

            migrationBuilder.Sql(@"
                UPDATE q SET q.ValuableItemsJson = ISNULL((
                    SELECT vi.ItemId      AS itemId,
                           vi.Category   AS category,
                           vi.Description AS description,
                           vi.Value      AS value
                    FROM   ValuableItems vi
                    WHERE  vi.QuotationId = q.QuotationId
                    FOR JSON PATH
                ), '[]')
                FROM Quotations q
            ");

            migrationBuilder.Sql(@"
                UPDATE p SET p.DocumentsJson = ISNULL((
                    SELECT pd.DocumentId AS documentId,
                           pd.FileName   AS fileName,
                           pd.FileUrl    AS fileUrl,
                           pd.FileType   AS fileType,
                           pd.UploadedAt AS uploadedAt
                    FROM   PolicyDocuments pd
                    WHERE  pd.PolicyId = p.PolicyId
                    FOR JSON PATH
                ), '[]')
                FROM Policies p
            ");

            migrationBuilder.Sql(@"
                INSERT INTO RegionConfigs
                    (Id, Region, IsActive,
                     BuildingRate, ContentRate, MinBuildingSum, MaxBuildingSum, MinContentSum, MaxContentSum,
                     ServiceTaxRate, StampDutyAmount, StampDutyWaiverEligiblePremium,
                     AreaUnit, AreaMin, AreaMax, StoreyIncrementPct, MaxStoreys, ProfessionalFeeRate, BenchmarkYear,
                     BuildingRatesJson, ValuableRatesJson,
                     CreatedAt)
                SELECT
                    NEWID(),
                    ppr.Region,
                    1,
                    ppr.BuildingRate, ppr.ContentRate, ppr.MinBuildingSum, ppr.MaxBuildingSum, ppr.MinContentSum, ppr.MaxContentSum,
                    ISNULL(tc.ServiceTaxRate, 0),
                    ISNULL(tc.StampDutyAmount, 0),
                    ISNULL(tc.StampDutyWaiverEligiblePremium, 0),
                    ISNULL(rrc.AreaUnit, 'sqm'),
                    ISNULL(rrc.AreaMin, 0),
                    ISNULL(rrc.AreaMax, 0),
                    ISNULL(rrc.StoreyIncrementPct, 0.05),
                    ISNULL(rrc.MaxStoreys, 5),
                    ISNULL(rrc.ProfessionalFeeRate, 0.10),
                    ISNULL(rrc.BenchmarkYear, 2024),
                    '[]',
                    '[]',
                    GETUTCDATE()
                FROM ProductPremiumRates ppr
                LEFT JOIN TaxConfigs tc
                    ON tc.Region = ppr.Region AND tc.IsActive = 1
                LEFT JOIN RegionRateConfigs rrc
                    ON rrc.Region = ppr.Region AND rrc.IsActive = 1
                WHERE ppr.IsActive = 1
            ");

            migrationBuilder.Sql(@"
                UPDATE rc SET rc.BuildingRatesJson = ISNULL((
                    SELECT bcr.Id               AS id,
                           bcr.PropertySubType  AS propertySubType,
                           bcr.ConstructionType AS constructionType,
                           bcr.RatePerUnit      AS ratePerUnit,
                           bcr.IsActive         AS isActive
                    FROM   BuildingConstructionRates bcr
                    WHERE  bcr.Region = rc.Region
                    FOR JSON PATH
                ), '[]')
                FROM RegionConfigs rc
            ");

            migrationBuilder.Sql(@"
                UPDATE rc SET rc.ValuableRatesJson = ISNULL((
                    SELECT vcr.Category   AS category,
                           vcr.MaxPerItem AS maxPerItem,
                           vcr.MaxTotal   AS maxTotal,
                           vcr.Rate       AS rate
                    FROM   ValuableCategoryRates vcr
                    WHERE  vcr.Region = rc.Region AND vcr.IsActive = 1
                    FOR JSON PATH
                ), '[]')
                FROM RegionConfigs rc
            ");

            migrationBuilder.Sql(@"
                INSERT INTO RateMultiplierConfigs
                    (Id, Region, Type, FactorKey, Multiplier, Label, KeywordsJson, Description, IsActive, CreatedAt)
                SELECT
                    Id, Region, 'location_tier', Tier, Multiplier, Label, KeywordsJson, NULL, IsActive, CreatedAt
                FROM LocationTierConfigs
            ");

            migrationBuilder.Sql(@"
                INSERT INTO RateMultiplierConfigs
                    (Id, Region, Type, FactorKey, Multiplier, Label, KeywordsJson, Description, IsActive, CreatedAt)
                SELECT
                    Id, Region, 'risk_factor', FactorKey, Multiplier,
                    ISNULL(Description, FactorKey),
                    NULL,
                    Description,
                    IsActive, CreatedAt
                FROM RiskMultiplierConfigs
            ");

            migrationBuilder.Sql(@"
                UPDATE a SET a.RatesJson = ISNULL((
                    SELECT CONCAT('{""', ar.Region, '"":',
                                  CAST(ar.Rate AS NVARCHAR(30)), '}')
                    FROM AddOnRates ar
                    WHERE ar.AddOnCode = a.Code AND ar.IsActive = 1
                ), '{}')
                FROM AddOns a
            ");

            migrationBuilder.Sql(@"
                UPDATE s SET s.ChangeLogsJson = ISNULL((
                    SELECT l.Id        AS id,
                           l.TableName AS tableName,
                           l.RecordId  AS recordId,
                           l.FieldName AS fieldName,
                           l.OldValue  AS oldValue,
                           l.NewValue  AS newValue,
                           l.ChangedBy AS changedBy,
                           l.ChangedAt AS changedAt
                    FROM   RateConfigChangeLogs l
                    WHERE  l.SnapshotId = s.Id
                    FOR JSON PATH
                ), '[]')
                FROM RateConfigSnapshots s
            ");


            migrationBuilder.DropForeignKey("FK_Customers_Addresses_AddressId",   "Customers");
            migrationBuilder.DropForeignKey("FK_Quotations_Products_ProductId",   "Quotations");
            migrationBuilder.DropForeignKey("FK_AddOnRates_AddOns_AddOnCode",     "AddOnRates");
            migrationBuilder.DropIndex("IX_Quotations_ProductId",  "Quotations");
            migrationBuilder.DropIndex("IX_Customers_AddressId",   "Customers");
            migrationBuilder.DropUniqueConstraint("AK_AddOns_Code", "AddOns");


            migrationBuilder.DropTable("AddOnRates");
            migrationBuilder.DropTable("Addresses");
            migrationBuilder.DropTable("BuildingConstructionRates");
            migrationBuilder.DropTable("LocationTierConfigs");
            migrationBuilder.DropTable("PolicyDocuments");
            migrationBuilder.DropTable("ProductPremiumRates");
            migrationBuilder.DropTable("Products");
            migrationBuilder.DropTable("QuotationPremiums");
            migrationBuilder.DropTable("RateConfigChangeLogs");
            migrationBuilder.DropTable("RegionRateConfigs");
            migrationBuilder.DropTable("RiskMultiplierConfigs");
            migrationBuilder.DropTable("TaxConfigs");
            migrationBuilder.DropTable("ValuableCategoryRates");
            migrationBuilder.DropTable("ValuableItems");


            migrationBuilder.DropColumn("ProductId", "Quotations");
            migrationBuilder.DropColumn("AddressId", "Customers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropTable("RateMultiplierConfigs");
            migrationBuilder.DropTable("RegionConfigs");
            migrationBuilder.DropIndex("IX_AddOns_Code", "AddOns");

            migrationBuilder.DropColumn("ChangeLogsJson",      "RateConfigSnapshots");
            migrationBuilder.DropColumn("AddOnPremium",        "Quotations");
            migrationBuilder.DropColumn("DiscountAmount",      "Quotations");
            migrationBuilder.DropColumn("GrossPremium",        "Quotations");
            migrationBuilder.DropColumn("NetPremium",          "Quotations");
            migrationBuilder.DropColumn("PlanPremium",         "Quotations");
            migrationBuilder.DropColumn("StampDuty",           "Quotations");
            migrationBuilder.DropColumn("TaxAmount",           "Quotations");
            migrationBuilder.DropColumn("TaxRate",             "Quotations");
            migrationBuilder.DropColumn("TotalBeforeDiscount", "Quotations");
            migrationBuilder.DropColumn("ValuableItemsJson",   "Quotations");
            migrationBuilder.DropColumn("DocumentsJson",       "Policies");
            migrationBuilder.DropColumn("RatesJson",           "AddOns");
            migrationBuilder.DropColumn("AddressLine1",        "Customers");
            migrationBuilder.DropColumn("AddressLine2",        "Customers");
            migrationBuilder.DropColumn("City",                "Customers");
            migrationBuilder.DropColumn("Country",             "Customers");
            migrationBuilder.DropColumn("Postcode",            "Customers");
            migrationBuilder.DropColumn("State",               "Customers");
        }
    }
}

