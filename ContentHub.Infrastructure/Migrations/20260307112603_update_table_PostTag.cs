using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContentHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class update_table_PostTag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Guid",
                table: "PostTags",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "PostTags",
                newName: "Guid");
        }
    }
}
