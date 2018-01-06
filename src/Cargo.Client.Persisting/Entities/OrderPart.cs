using System.Collections.Generic;

namespace Cargo.Client.Persisting.Entities
{
    public class OrderPart
    {
        public int Id { get; set; }

        public int PartId { get; set; }
        public virtual Part Part { get; set; }
        public int OrderId { get; set; }
        public virtual Order Order { get; set; }

        public virtual ICollection<BatchOrderPart> BatchOrderParts { get; set; }
        
        public int? SuccessfulBatchId { get; set; }
        public virtual Batch SuccessfulBatch { get; set; }
    }
}
