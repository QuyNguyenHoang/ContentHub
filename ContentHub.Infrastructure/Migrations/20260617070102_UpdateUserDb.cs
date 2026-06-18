using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ContentHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LoginProvider",
                table: "AppUsers",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProviderUserId",
                table: "AppUsers",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "AppUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_ProviderUserId",
                table: "AppUsers",
                column: "ProviderUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_UserId",
                table: "AppUsers",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppUsers_ProviderUserId",
                table: "AppUsers");

            migrationBuilder.DropIndex(
                name: "IX_AppUsers_UserId",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "LoginProvider",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "ProviderUserId",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AppUsers");
        }
    }
}
