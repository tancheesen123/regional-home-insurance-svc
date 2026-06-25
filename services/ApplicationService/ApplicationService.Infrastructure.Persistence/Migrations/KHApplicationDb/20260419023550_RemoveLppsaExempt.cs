using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.KHApplicationDb
{
    public partial class RemoveLppsaExempt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLppsaExempt",
                table: "AddOns");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsLppsaExempt",
                table: "AddOns",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
