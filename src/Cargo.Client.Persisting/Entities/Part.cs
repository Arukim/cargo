using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting.Entities
{
    public class Part
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Filename { get; set; }
        
        public int PartInfoId { get; set; }
        public PartInfo PartInfo { get; set; }

        public int OrderId { get; set; }
        public virtual Order Order { get; set; }
        public virtual ICollection<OrderPart> OrderParts { get; set; }
     }
}
