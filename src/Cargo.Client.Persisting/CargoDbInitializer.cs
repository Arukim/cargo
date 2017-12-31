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
            ctx.Parts.Add(new Entity.Part { Name = "Part A" });

            base.Seed(ctx);
        }
    }
}
