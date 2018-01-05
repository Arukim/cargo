﻿// <auto-generated />
using Cargo.Client.Persisting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace Cargo.Client.Persisting.Migrations
{
    [DbContext(typeof(CargoContext))]
    partial class CargoContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Cargo.Client.Persisting.Entities.Batch", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.HasKey("Id");

                    b.ToTable("Batches");
                });

            modelBuilder.Entity("Cargo.Client.Persisting.Entities.Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("Cargo.Client.Persisting.Entities.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CustomerId");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("Cargo.Client.Persisting.Entities.OrderPart", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("BatchId");

                    b.Property<int>("OrderId");

                    b.Property<int>("PartId");

                    b.HasKey("Id");

                    b.HasIndex("BatchId");

                    b.HasIndex("OrderId");

                    b.HasIndex("PartId");

                    b.ToTable("OrderParts");
                });

            modelBuilder.Entity("Cargo.Client.Persisting.Entities.Part", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CustomerId");

                    b.Property<string>("Filename");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("Parts");
                });

            modelBuilder.Entity("Cargo.Client.Persisting.Entities.Order", b =>
                {
                    b.HasOne("Cargo.Client.Persisting.Entities.Customer", "Customer")
                        .WithMany("Orders")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Cargo.Client.Persisting.Entities.OrderPart", b =>
                {
                    b.HasOne("Cargo.Client.Persisting.Entities.Batch", "Batch")
                        .WithMany("OrderParts")
                        .HasForeignKey("BatchId");

                    b.HasOne("Cargo.Client.Persisting.Entities.Order", "Order")
                        .WithMany("OrderParts")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Cargo.Client.Persisting.Entities.Part", "Part")
                        .WithMany("OrderParts")
                        .HasForeignKey("PartId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Cargo.Client.Persisting.Entities.Part", b =>
                {
                    b.HasOne("Cargo.Client.Persisting.Entities.Customer", "Customer")
                        .WithMany("Parts")
                        .HasForeignKey("CustomerId");
                });
#pragma warning restore 612, 618
        }
    }
}
