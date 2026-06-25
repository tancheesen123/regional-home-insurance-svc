using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.KHApplicationDb
{
    public partial class AddValuableCategoryRates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ValuableCategoryRates",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    MaxPerItem = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(10,6)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValuableCategoryRates", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ValuableCategoryRates_Region_Category_IsActive",
                table: "ValuableCategoryRates",
                columns: new[] { "Region", "Category", "IsActive" });

            var now = DateTime.UtcNow;
            var khRates = new[]
            {
                ("jewellery",          2_500m,       7_500m,       0.020m),
                ("gold",               2_500m,       7_500m,       0.020m),
                ("electronics",        2_000m,       5_000m,       0.015m),
                ("artwork",            3_750m,       7_500m,       0.018m),
                ("sports-equipment",   1_250m,       3_750m,       0.015m),
                ("other",              1_250m,       5_000m,       0.015m),
            };

            foreach (var (cat, maxItem, maxTotal, rate) in khRates)
            {
                migrationBuilder.InsertData(
                    table: "ValuableCategoryRates",
                    columns: new[] { "Id", "Region", "Category", "MaxPerItem", "MaxTotal", "Rate", "IsActive", "CreatedAt" },
                    values: new object[] { Guid.NewGuid().ToString(), "KH", cat, maxItem, maxTotal, rate, true, now });
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ValuableCategoryRates");
        }
    }
}
