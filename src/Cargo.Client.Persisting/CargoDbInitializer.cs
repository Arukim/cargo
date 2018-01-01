using Cargo.Client.Persisting.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting
{
    class CargoDbInitializer : DropCreateDatabaseIfModelChanges<CargoDbContext>
    {
        public CargoDbInitializer()
        {
        }

        protected override void Seed(CargoDbContext ctx)
        {
            var parts = new List<Part> {
                new Part {
                    Id = 0,
                    Name = "Part A"
                },
                new Part
                {
                    Id = 1,
                    Name = "Part B"
                },
                new Part
                {
                    Id = 2,
                    Name = "Part C"
                }
            };

            var customers = new List<Customer>
            {
                new Customer
                {
                    Id = 0,
                    Name = "Contoso"
                },
                new Customer
                {
                    Id = 1,
                    Name = "Teplocom"
                }
            };

            var orders = new List<Order>
            {
                new Order
                {
                    Id = 0,
                    Name = "First Order",
                    Customer = customers[0],
                    OrderParts = new List<OrderPart>
                    {
                        new OrderPart
                        {
                            Part = parts[0]
                        },
                        new OrderPart
                        {
                            Part = parts[0]
                        },
                        new OrderPart
                        {
                            Part = parts[2]
                        }
                    }
                },
                new Order
                {
                    Id = 1,
                    Name = "Second Order",
                    Customer = customers[1],
                    OrderParts = new List<OrderPart>
                    {
                        new OrderPart
                        {
                            Part = parts[1]
                        },
                        new OrderPart
                        {
                            Part = parts[2]
                        }
                    }
                }
            };

            ctx.Parts.AddRange(parts);
            ctx.Customers.AddRange(customers);
            ctx.Orders.AddRange(orders);

            base.Seed(ctx);
        }
    }
}
