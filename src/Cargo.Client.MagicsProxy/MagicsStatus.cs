using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.MagicsProxy
{
    public class MagicsStatus
    {
        public int ModelsCount { get; set; }
        public double ModelsVolume { get; set; }
        public List<int> OrderParts { get; set; }
    }
}
