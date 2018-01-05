using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Cargo.Client.Persisting.Migrations
{
    public partial class BatchFilename : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Filename",
                table: "Batches",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Batches",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Filename",
                table: "Batches");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Batches");
        }
    }
}
