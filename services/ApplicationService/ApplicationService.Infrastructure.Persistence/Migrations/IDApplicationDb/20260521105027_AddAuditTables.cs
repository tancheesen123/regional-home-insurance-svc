using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationService.Infrastructure.Persistence.Migrations.IDApplicationDb
{
    public partial class AddAuditTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RateConfigSnapshots",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Label = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SnapshotJson = table.Column<string>(type: "TEXT", nullable: false),
                    SnapshotType = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RateConfigSnapshots", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RateConfigChangeLogs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SnapshotId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    TableName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    RecordId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FieldName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    OldValue = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    NewValue = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ChangedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RateConfigChangeLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RateConfigChangeLogs_RateConfigSnapshots_SnapshotId",
                        column: x => x.SnapshotId,
                        principalTable: "RateConfigSnapshots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RateConfigChangeLogs_Region_ChangedAt",
                table: "RateConfigChangeLogs",
                columns: new[] { "Region", "ChangedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_RateConfigChangeLogs_SnapshotId",
                table: "RateConfigChangeLogs",
                column: "SnapshotId");

            migrationBuilder.CreateIndex(
                name: "IX_RateConfigSnapshots_Region_CreatedAt",
                table: "RateConfigSnapshots",
                columns: new[] { "Region", "CreatedAt" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RateConfigChangeLogs");

            migrationBuilder.DropTable(
                name: "RateConfigSnapshots");
        }
    }
}
