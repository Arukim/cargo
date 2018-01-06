namespace Cargo.Client.Persisting.Entities
{
    public class BatchOrderPart
    {
        public int Id { get; set; }
        public int BatchId { get; set; }
        public virtual Batch Batch { get; set; }

        public int OrderPartId { get; set; }
        public virtual OrderPart OrderPart { get; set; }
    }
}
