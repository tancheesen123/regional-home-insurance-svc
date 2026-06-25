using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.PHApplicationDb
{
    public partial class SeedValuableCategoryRates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var now = DateTime.UtcNow;
            var rows = new[]
            {
                ("jewellery",           55_000m,         165_000m,        0.020m),
                ("gold",                55_000m,         165_000m,        0.020m),
                ("electronics",         44_000m,         110_000m,        0.015m),
                ("artwork",             82_500m,         165_000m,        0.018m),
                ("sports-equipment",    27_500m,          82_500m,        0.015m),
                ("other",               27_500m,         110_000m,        0.015m),
            };

            foreach (var (cat, maxItem, maxTotal, rate) in rows)
            {
                migrationBuilder.InsertData(
                    table: "ValuableCategoryRates",
                    columns: new[] { "Id", "Region", "Category", "MaxPerItem", "MaxTotal", "Rate", "IsActive", "CreatedAt" },
                    values: new object[] { Guid.NewGuid().ToString(), "PH", cat, maxItem, maxTotal, rate, true, now });
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ValuableCategoryRates",
                keyColumn: "Region",
                keyValue: "PH");
        }
    }
}
