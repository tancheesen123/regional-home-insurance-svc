using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.KHApplicationDb
{
    public partial class RemoveRedundantIdColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "ValuableItems");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserAccounts");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PolicyDocuments");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Policies");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PaymentGateways");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "CustomerPaymentMethods");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "ValuableItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "UserAccounts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Quotations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Proposals",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "PolicyDocuments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Policies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "PaymentGateways",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Customers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "CustomerPaymentMethods",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
