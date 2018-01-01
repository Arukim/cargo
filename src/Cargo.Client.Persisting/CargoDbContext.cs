using Cargo.Client.Persisting.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting
{
    
    public class CargoDbContext : DbContext
    {
        public CargoDbContext() : base("CargoContext")
        {
            Database.SetInitializer(new CargoDbInitializer());
        }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<OrderPart> OrderParts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Batch> Batches { get; set; }
    }
}
