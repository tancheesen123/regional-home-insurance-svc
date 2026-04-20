using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.PHApplicationDb
{
    /// <inheritdoc />
    public partial class SeedValuableCategoryRates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── Philippines (PHP) ─────────────────────────────────────────────
            // Rates are the same % as other regions; limits scaled to PHP values.
            var now = DateTime.UtcNow;
            var rows = new[]
            {
                // category             maxPerItem       maxTotal         rate
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ValuableCategoryRates",
                keyColumn: "Region",
                keyValue: "PH");
        }
    }
}
