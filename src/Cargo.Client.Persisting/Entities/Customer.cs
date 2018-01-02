using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting.Entities
{
    public class Customer
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
