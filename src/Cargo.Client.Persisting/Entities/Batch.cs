using System.Collections.Generic;

namespace Cargo.Client.Persisting.Entities
{
    public class Batch
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Filename { get; set; }

        public virtual ICollection<BatchOrderPart> BatchOrderParts { get; set; }
    }
}
