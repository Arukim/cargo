using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Cargo.Client.Persisting.Migrations
{
    public partial class OrderPartSuccessfulBatch : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SuccessfulBatchId",
                table: "OrderParts",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderParts_SuccessfulBatchId",
                table: "OrderParts",
                column: "SuccessfulBatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderParts_Batches_SuccessfulBatchId",
                table: "OrderParts",
                column: "SuccessfulBatchId",
                principalTable: "Batches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderParts_Batches_SuccessfulBatchId",
                table: "OrderParts");

            migrationBuilder.DropIndex(
                name: "IX_OrderParts_SuccessfulBatchId",
                table: "OrderParts");

            migrationBuilder.DropColumn(
                name: "SuccessfulBatchId",
                table: "OrderParts");
        }
    }
}
