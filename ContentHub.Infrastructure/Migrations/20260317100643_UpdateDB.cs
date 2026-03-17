using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContentHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Postid",
                table: "PostPictures",
                newName: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostVideos_PostId",
                table: "PostVideos",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostPictures_PostId",
                table: "PostPictures",
                column: "PostId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostPictures_Posts_PostId",
                table: "PostPictures",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostVideos_Posts_PostId",
                table: "PostVideos",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostPictures_Posts_PostId",
                table: "PostPictures");

            migrationBuilder.DropForeignKey(
                name: "FK_PostVideos_Posts_PostId",
                table: "PostVideos");

            migrationBuilder.DropIndex(
                name: "IX_PostVideos_PostId",
                table: "PostVideos");

            migrationBuilder.DropIndex(
                name: "IX_PostPictures_PostId",
                table: "PostPictures");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "PostPictures",
                newName: "Postid");
        }
    }
}
