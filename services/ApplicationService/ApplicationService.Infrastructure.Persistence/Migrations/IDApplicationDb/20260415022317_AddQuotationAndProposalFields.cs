using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.IDApplicationDb
{
    public partial class AddQuotationAndProposalFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConstructionType",
                table: "Quotations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CoverageStartDate",
                table: "Quotations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "CurrentFlooding",
                table: "Quotations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DateOfBirth",
                table: "Quotations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdNumber",
                table: "Quotations",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdType",
                table: "Quotations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "Quotations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfStorey",
                table: "Quotations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OwnershipType",
                table: "Quotations",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Postcode",
                table: "Quotations",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "PreviousLoss",
                table: "Quotations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PropertySubType",
                table: "Quotations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropertyType",
                table: "Quotations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Quotations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "UnoccupiedProperty",
                table: "Quotations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BankAccountNumber",
                table: "Proposals",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "Proposals",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DateOfBirth",
                table: "Proposals",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Proposals",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdNumber",
                table: "Proposals",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdType",
                table: "Proposals",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailAddressLine1",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailAddressLine2",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailCity",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailCountry",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailPostcode",
                table: "Proposals",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MailState",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MailingSameAsProperty",
                table: "Proposals",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MobileNumber",
                table: "Proposals",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "Proposals",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropAddressLine1",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropAddressLine2",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropCity",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropCountry",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropPostcode",
                table: "Proposals",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropState",
                table: "Proposals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Race",
                table: "Proposals",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConstructionType",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "CoverageStartDate",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "CurrentFlooding",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "IdNumber",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "IdType",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "NumberOfStorey",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "OwnershipType",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "Postcode",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "PreviousLoss",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "PropertySubType",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "PropertyType",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "UnoccupiedProperty",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "BankAccountNumber",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "BankName",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "IdNumber",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "IdType",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "MailAddressLine1",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "MailAddressLine2",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "MailCity",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "MailCountry",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "MailPostcode",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "MailState",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "MailingSameAsProperty",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "MobileNumber",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "PropAddressLine1",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "PropAddressLine2",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "PropCity",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "PropCountry",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "PropPostcode",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "PropState",
                table: "Proposals");

            migrationBuilder.DropColumn(
                name: "Race",
                table: "Proposals");
        }
    }
}
