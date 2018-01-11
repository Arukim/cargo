using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Persisting.Entities
{
    public class PartInfo
    {
        public int Id { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Z { get; set; }
        public double SurfaceArea { get; set; }
        public double Volume { get; set; }

        [ForeignKey("Part")]
        public int PartId { get; set; }
        public virtual Part Part {get;set;}
}
}
