using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.KHApplicationDb
{
    public partial class SeedValuableCategoryRates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var now = DateTime.UtcNow;
            var rows = new[]
            {
                ("jewellery",           2_500m,       7_500m,       0.020m),
                ("gold",                2_500m,       7_500m,       0.020m),
                ("electronics",         2_000m,       5_000m,       0.015m),
                ("artwork",             3_750m,       7_500m,       0.018m),
                ("sports-equipment",    1_250m,       3_750m,       0.015m),
                ("other",               1_250m,       5_000m,       0.015m),
            };

            foreach (var (cat, maxItem, maxTotal, rate) in rows)
            {
                migrationBuilder.InsertData(
                    table: "ValuableCategoryRates",
                    columns: new[] { "Id", "Region", "Category", "MaxPerItem", "MaxTotal", "Rate", "IsActive", "CreatedAt" },
                    values: new object[] { Guid.NewGuid().ToString(), "KH", cat, maxItem, maxTotal, rate, true, now });
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ValuableCategoryRates",
                keyColumn: "Region",
                keyValue: "KH");
        }
    }
}
