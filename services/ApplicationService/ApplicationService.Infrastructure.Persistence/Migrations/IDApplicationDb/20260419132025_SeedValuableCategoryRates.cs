using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.IDApplicationDb
{
    /// <inheritdoc />
    public partial class SeedValuableCategoryRates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── Indonesia (IDR) ───────────────────────────────────────────────
            // Limits scaled to Rupiah values (~4,000× USD equivalent).
            var now = DateTime.UtcNow;
            var rows = new[]
            {
                // category             maxPerItem           maxTotal             rate
                ("jewellery",           20_000_000m,         60_000_000m,         0.020m),
                ("gold",                20_000_000m,         60_000_000m,         0.020m),
                ("electronics",         16_000_000m,         40_000_000m,         0.015m),
                ("artwork",             30_000_000m,         60_000_000m,         0.018m),
                ("sports-equipment",    10_000_000m,         30_000_000m,         0.015m),
                ("other",               10_000_000m,         40_000_000m,         0.015m),
            };

            foreach (var (cat, maxItem, maxTotal, rate) in rows)
            {
                migrationBuilder.InsertData(
                    table: "ValuableCategoryRates",
                    columns: new[] { "Id", "Region", "Category", "MaxPerItem", "MaxTotal", "Rate", "IsActive", "CreatedAt" },
                    values: new object[] { Guid.NewGuid().ToString(), "ID", cat, maxItem, maxTotal, rate, true, now });
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ValuableCategoryRates",
                keyColumn: "Region",
                keyValue: "ID");
        }
    }
}
