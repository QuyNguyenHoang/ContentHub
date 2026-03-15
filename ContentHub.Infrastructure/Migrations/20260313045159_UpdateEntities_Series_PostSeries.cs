using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContentHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntities_Series_PostSeries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PostSeries",
                table: "PostSeries");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PostSeries");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Series",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostSeries",
                table: "PostSeries",
                columns: new[] { "PostId", "SeriesId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PostSeries",
                table: "PostSeries");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Series",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "PostSeries",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostSeries",
                table: "PostSeries",
                column: "Id");
        }
    }
}
