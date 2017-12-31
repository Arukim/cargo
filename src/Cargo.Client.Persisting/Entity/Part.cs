using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting.Entity
{
    public class Part
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int? CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual List<OrderPart> OrderParts { get; set; }
     }
}
