using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Cargo.Client.Persisting.Migrations
{
    public partial class BatchOrderPart : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderParts_Batches_BatchId",
                table: "OrderParts");

            migrationBuilder.DropIndex(
                name: "IX_OrderParts_BatchId",
                table: "OrderParts");

            migrationBuilder.DropColumn(
                name: "BatchId",
                table: "OrderParts");

            migrationBuilder.CreateTable(
                name: "BatchOrderParts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BatchId = table.Column<int>(nullable: false),
                    OrderPartId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BatchOrderParts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BatchOrderParts_Batches_BatchId",
                        column: x => x.BatchId,
                        principalTable: "Batches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BatchOrderParts_OrderParts_OrderPartId",
                        column: x => x.OrderPartId,
                        principalTable: "OrderParts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BatchOrderParts_BatchId",
                table: "BatchOrderParts",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_BatchOrderParts_OrderPartId",
                table: "BatchOrderParts",
                column: "OrderPartId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BatchOrderParts");

            migrationBuilder.AddColumn<int>(
                name: "BatchId",
                table: "OrderParts",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderParts_BatchId",
                table: "OrderParts",
                column: "BatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderParts_Batches_BatchId",
                table: "OrderParts",
                column: "BatchId",
                principalTable: "Batches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
