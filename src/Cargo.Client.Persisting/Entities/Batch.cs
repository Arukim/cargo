using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting.Entities
{
    public class Batch
    {
        public int Id { get; set; }

        public virtual ICollection<OrderPart> OrderParts { get; set; }
        public string Name { get; set; }
        public string Filename { get; set; }
    }
}
