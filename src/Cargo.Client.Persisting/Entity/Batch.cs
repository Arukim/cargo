using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting.Entity
{
    public class Batch
    {
        public int Id { get; set; }

        public virtual List<OrderPart> OrderParts { get; set; }
    }
}
