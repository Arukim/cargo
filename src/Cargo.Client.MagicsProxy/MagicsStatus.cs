using System.Collections.Generic;

namespace Cargo.Client.MagicsProxy
{
    public class MagicsStatus
    {
        public int ModelsCount { get; set; }
        public double ModelsVolume { get; set; }
        public List<int> OrderParts { get; set; }
    }
}
