using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting.Entities
{
    public class OrderPart
    {
        public int Id { get; set; }

        public int PartId { get; set; }
        public virtual Part Part { get; set; }
        public int OrderId { get; set; }
        public virtual Order Order { get; set; }
        public int? BatchId { get; set; }
        public virtual Batch Batch { get; set; }
    }
}
