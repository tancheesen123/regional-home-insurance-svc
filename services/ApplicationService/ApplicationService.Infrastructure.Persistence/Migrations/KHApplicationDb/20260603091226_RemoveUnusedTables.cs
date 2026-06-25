using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.KHApplicationDb
{
    public partial class RemoveUnusedTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_PaymentGateways_GatewayName",
                table: "Payments");

            migrationBuilder.DropTable(
                name: "CustomerPaymentMethods");

            migrationBuilder.DropTable(
                name: "PaymentGateways");

            migrationBuilder.DropIndex(
                name: "IX_Payments_GatewayName",
                table: "Payments");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerPaymentMethods",
                columns: table => new
                {
                    PaymentMethodId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CustomerId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CardHolderName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CardType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ExpiryMonth = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    ExpiryYear = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
                    LastFourDigits = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerPaymentMethods", x => x.PaymentMethodId);
                    table.ForeignKey(
                        name: "FK_CustomerPaymentMethods_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PaymentGateways",
                columns: table => new
                {
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ApiKey = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SupportedRegions = table.Column<string>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentGateways", x => x.Name);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_GatewayName",
                table: "Payments",
                column: "GatewayName");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPaymentMethods_CustomerId",
                table: "CustomerPaymentMethods",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_PaymentGateways_GatewayName",
                table: "Payments",
                column: "GatewayName",
                principalTable: "PaymentGateways",
                principalColumn: "Name");
        }
    }
}
