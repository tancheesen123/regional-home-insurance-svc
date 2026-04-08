using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.KHApplicationDb
{
    /// <inheritdoc />
    public partial class AddProfilePictureToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePicturePath",
                table: "Customers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePicturePath",
                table: "Customers");
        }
    }
}
