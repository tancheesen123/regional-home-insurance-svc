using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.PHApplicationDb
{
    /// <inheritdoc />
    public partial class AddQuotationPremiumTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuotationPremiums",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    QuotationId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PlanPremium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AddOnPremium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GrossPremium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DiscountAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NetPremium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    TaxAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StampDuty = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalPremium = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalBeforeDiscount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationPremiums", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationPremiums_Quotations_QuotationId",
                        column: x => x.QuotationId,
                        principalTable: "Quotations",
                        principalColumn: "QuotationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuotationPremiums_QuotationId",
                table: "QuotationPremiums",
                column: "QuotationId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuotationPremiums");
        }
    }
}
