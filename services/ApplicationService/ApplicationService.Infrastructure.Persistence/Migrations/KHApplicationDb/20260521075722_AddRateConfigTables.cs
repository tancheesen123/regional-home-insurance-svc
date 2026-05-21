using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.KHApplicationDb
{
    /// <inheritdoc />
    public partial class AddRateConfigTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BuildingConstructionRates",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    PropertySubType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ConstructionType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    RatePerUnit = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingConstructionRates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LocationTierConfigs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Tier = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Multiplier = table.Column<decimal>(type: "decimal(5,4)", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    KeywordsJson = table.Column<string>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationTierConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RegionRateConfigs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    AreaUnit = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    AreaMin = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    AreaMax = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    StoreyIncrementPct = table.Column<decimal>(type: "decimal(5,4)", nullable: false),
                    MaxStoreys = table.Column<int>(type: "int", nullable: false),
                    ProfessionalFeeRate = table.Column<decimal>(type: "decimal(5,4)", nullable: false),
                    BenchmarkYear = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegionRateConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RiskMultiplierConfigs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    FactorKey = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    Multiplier = table.Column<decimal>(type: "decimal(10,4)", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskMultiplierConfigs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingConstructionRates_Region_PropertySubType_ConstructionType_IsActive",
                table: "BuildingConstructionRates",
                columns: new[] { "Region", "PropertySubType", "ConstructionType", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_LocationTierConfigs_Region_Tier_IsActive",
                table: "LocationTierConfigs",
                columns: new[] { "Region", "Tier", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_RegionRateConfigs_Region_IsActive",
                table: "RegionRateConfigs",
                columns: new[] { "Region", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_RiskMultiplierConfigs_Region_FactorKey_IsActive",
                table: "RiskMultiplierConfigs",
                columns: new[] { "Region", "FactorKey", "IsActive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuildingConstructionRates");

            migrationBuilder.DropTable(
                name: "LocationTierConfigs");

            migrationBuilder.DropTable(
                name: "RegionRateConfigs");

            migrationBuilder.DropTable(
                name: "RiskMultiplierConfigs");
        }
    }
}
