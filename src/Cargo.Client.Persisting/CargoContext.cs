using Cargo.Client.Persisting.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cargo.Client.Persisting
{
    public class CargoContext : DbContext
    {
        public static string ConnectionString { get; set; }
        public CargoContext() : base()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(ConnectionString);
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<OrderPart> OrderParts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Batch> Batches { get; set; }
    }
}
