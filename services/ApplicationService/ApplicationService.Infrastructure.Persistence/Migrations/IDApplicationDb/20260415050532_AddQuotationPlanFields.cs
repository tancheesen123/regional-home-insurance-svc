using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.IDApplicationDb
{
    public partial class AddQuotationPlanFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BuildingSum",
                table: "Quotations",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ContentsSum",
                table: "Quotations",
                type: "decimal(15,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasAlternativeAccommodation",
                table: "Quotations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasExtendedTheft",
                table: "Quotations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasPublicLiability",
                table: "Quotations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasRiotStrike",
                table: "Quotations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PlanType",
                table: "Quotations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuildingSum",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "ContentsSum",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "HasAlternativeAccommodation",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "HasExtendedTheft",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "HasPublicLiability",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "HasRiotStrike",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "PlanType",
                table: "Quotations");
        }
    }
}
