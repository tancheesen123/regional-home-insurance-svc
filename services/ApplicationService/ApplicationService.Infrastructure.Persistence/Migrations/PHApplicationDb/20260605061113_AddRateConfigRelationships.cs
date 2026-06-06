using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.PHApplicationDb
{
    /// <inheritdoc />
    public partial class AddRateConfigRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RegionConfigId",
                table: "RateMultiplierConfigs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegionConfigId",
                table: "RateConfigSnapshots",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegionConfigId",
                table: "Quotations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "QuotationAddOns",
                columns: table => new
                {
                    QuotationId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AddOnId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationAddOns", x => new { x.QuotationId, x.AddOnId });
                    table.ForeignKey(
                        name: "FK_QuotationAddOns_AddOns_AddOnId",
                        column: x => x.AddOnId,
                        principalTable: "AddOns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuotationAddOns_Quotations_QuotationId",
                        column: x => x.QuotationId,
                        principalTable: "Quotations",
                        principalColumn: "QuotationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RateMultiplierConfigs_RegionConfigId",
                table: "RateMultiplierConfigs",
                column: "RegionConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_RateConfigSnapshots_RegionConfigId",
                table: "RateConfigSnapshots",
                column: "RegionConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_RegionConfigId",
                table: "Quotations",
                column: "RegionConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationAddOns_AddOnId",
                table: "QuotationAddOns",
                column: "AddOnId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quotations_RegionConfigs_RegionConfigId",
                table: "Quotations",
                column: "RegionConfigId",
                principalTable: "RegionConfigs",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_RateConfigSnapshots_RegionConfigs_RegionConfigId",
                table: "RateConfigSnapshots",
                column: "RegionConfigId",
                principalTable: "RegionConfigs",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_RateMultiplierConfigs_RegionConfigs_RegionConfigId",
                table: "RateMultiplierConfigs",
                column: "RegionConfigId",
                principalTable: "RegionConfigs",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quotations_RegionConfigs_RegionConfigId",
                table: "Quotations");

            migrationBuilder.DropForeignKey(
                name: "FK_RateConfigSnapshots_RegionConfigs_RegionConfigId",
                table: "RateConfigSnapshots");

            migrationBuilder.DropForeignKey(
                name: "FK_RateMultiplierConfigs_RegionConfigs_RegionConfigId",
                table: "RateMultiplierConfigs");

            migrationBuilder.DropTable(
                name: "QuotationAddOns");

            migrationBuilder.DropIndex(
                name: "IX_RateMultiplierConfigs_RegionConfigId",
                table: "RateMultiplierConfigs");

            migrationBuilder.DropIndex(
                name: "IX_RateConfigSnapshots_RegionConfigId",
                table: "RateConfigSnapshots");

            migrationBuilder.DropIndex(
                name: "IX_Quotations_RegionConfigId",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "RegionConfigId",
                table: "RateMultiplierConfigs");

            migrationBuilder.DropColumn(
                name: "RegionConfigId",
                table: "RateConfigSnapshots");

            migrationBuilder.DropColumn(
                name: "RegionConfigId",
                table: "Quotations");
        }
    }
}
