using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContentHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePostActivityLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_PostActivityLogs_UserId",
                table: "PostActivityLogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostActivityLogs_AppUsers_UserId",
                table: "PostActivityLogs",
                column: "UserId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostActivityLogs_AppUsers_UserId",
                table: "PostActivityLogs");

            migrationBuilder.DropIndex(
                name: "IX_PostActivityLogs_UserId",
                table: "PostActivityLogs");
        }
    }
}
