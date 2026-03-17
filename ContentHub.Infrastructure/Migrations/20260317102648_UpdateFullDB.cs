using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContentHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFullDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostActivityBlogs");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "WalletTransactions",
                newName: "DateCreated");

            migrationBuilder.RenameColumn(
                name: "DateUpdate",
                table: "Wallets",
                newName: "DateModified");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Wallets",
                newName: "DateCreated");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Subscriptions",
                newName: "DateCreated");

            migrationBuilder.RenameColumn(
                name: "RoyaltyAmout",
                table: "Posts",
                newName: "RoyaltyAmount");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CancelledDate",
                table: "Subscriptions",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<byte>(
                name: "Status",
                table: "Posts",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "PostCategories",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PostCategories",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "PostActivityLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FromStatus = table.Column<byte>(type: "smallint", nullable: false),
                    ToStatus = table.Column<byte>(type: "smallint", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostActivityLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostActivityLogs_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WalletTransactions_WalletId",
                table: "WalletTransactions",
                column: "WalletId");

            migrationBuilder.CreateIndex(
                name: "IX_PostTags_TagId",
                table: "PostTags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_PostSeries_SeriesId",
                table: "PostSeries",
                column: "SeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_CategoryId",
                table: "Posts",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PostCategories_ParentId",
                table: "PostCategories",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_PostActivityLogs_PostId",
                table: "PostActivityLogs",
                column: "PostId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostCategories_PostCategories_ParentId",
                table: "PostCategories",
                column: "ParentId",
                principalTable: "PostCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_PostCategories_CategoryId",
                table: "Posts",
                column: "CategoryId",
                principalTable: "PostCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostSeries_Posts_PostId",
                table: "PostSeries",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostSeries_Series_SeriesId",
                table: "PostSeries",
                column: "SeriesId",
                principalTable: "Series",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostTags_Posts_PostId",
                table: "PostTags",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostTags_Tags_TagId",
                table: "PostTags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WalletTransactions_Wallets_WalletId",
                table: "WalletTransactions",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostCategories_PostCategories_ParentId",
                table: "PostCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_PostCategories_CategoryId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_PostSeries_Posts_PostId",
                table: "PostSeries");

            migrationBuilder.DropForeignKey(
                name: "FK_PostSeries_Series_SeriesId",
                table: "PostSeries");

            migrationBuilder.DropForeignKey(
                name: "FK_PostTags_Posts_PostId",
                table: "PostTags");

            migrationBuilder.DropForeignKey(
                name: "FK_PostTags_Tags_TagId",
                table: "PostTags");

            migrationBuilder.DropForeignKey(
                name: "FK_WalletTransactions_Wallets_WalletId",
                table: "WalletTransactions");

            migrationBuilder.DropTable(
                name: "PostActivityLogs");

            migrationBuilder.DropIndex(
                name: "IX_WalletTransactions_WalletId",
                table: "WalletTransactions");

            migrationBuilder.DropIndex(
                name: "IX_PostTags_TagId",
                table: "PostTags");

            migrationBuilder.DropIndex(
                name: "IX_PostSeries_SeriesId",
                table: "PostSeries");

            migrationBuilder.DropIndex(
                name: "IX_Posts_CategoryId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_PostCategories_ParentId",
                table: "PostCategories");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PostCategories");

            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "WalletTransactions",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "DateModified",
                table: "Wallets",
                newName: "DateUpdate");

            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "Wallets",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "Subscriptions",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "RoyaltyAmount",
                table: "Posts",
                newName: "RoyaltyAmout");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CancelledDate",
                table: "Subscriptions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Posts",
                type: "integer",
                nullable: false,
                oldClrType: typeof(byte),
                oldType: "smallint");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreated",
                table: "PostCategories",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.CreateTable(
                name: "PostActivityBlogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FromStatus = table.Column<int>(type: "integer", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false),
                    ToStatus = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostActivityBlogs", x => x.Id);
                });
        }
    }
}
