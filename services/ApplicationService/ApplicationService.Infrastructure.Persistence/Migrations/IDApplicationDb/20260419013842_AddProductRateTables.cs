using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.IDApplicationDb
{
    /// <inheritdoc />
    public partial class AddProductRateTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AddOns",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    EligiblePlanTypes = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    SumInsuredBasis = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    IsLppsaExempt = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AddOns", x => x.Id);
                    table.UniqueConstraint("AK_AddOns_Code", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "ProductPremiumRates",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    BuildingRate = table.Column<decimal>(type: "decimal(10,6)", nullable: false),
                    ContentRate = table.Column<decimal>(type: "decimal(10,6)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPremiumRates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TaxConfigs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    ServiceTaxRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    StampDutyAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    StampDutyWaiverEligiblePremium = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaxConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AddOnRates",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AddOnCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(10,6)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AddOnRates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AddOnRates_AddOns_AddOnCode",
                        column: x => x.AddOnCode,
                        principalTable: "AddOns",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AddOnRates_AddOnCode_Region",
                table: "AddOnRates",
                columns: new[] { "AddOnCode", "Region" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AddOns_Code",
                table: "AddOns",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductPremiumRates_Region_IsActive",
                table: "ProductPremiumRates",
                columns: new[] { "Region", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_TaxConfigs_Region_IsActive",
                table: "TaxConfigs",
                columns: new[] { "Region", "IsActive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AddOnRates");

            migrationBuilder.DropTable(
                name: "ProductPremiumRates");

            migrationBuilder.DropTable(
                name: "TaxConfigs");

            migrationBuilder.DropTable(
                name: "AddOns");
        }
    }
}
