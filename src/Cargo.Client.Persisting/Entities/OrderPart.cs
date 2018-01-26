using System.Collections.Generic;

namespace Cargo.Client.Persisting.Entities
{
	public class OrderPart
	{
		public int Id { get; set; }
		public OrderPartStatus Status { get; set; }

		public int? PartId { get; set; }
		public Part Part { get; set; }
		public int OrderId { get; set; }
		public Order Order { get; set; }

		public ICollection<BatchOrderPart> BatchOrderParts { get; set; }

		public int? SuccessfulBatchId { get; set; }
		public Batch SuccessfulBatch { get; set; }
	}

	public enum OrderPartStatus
	{
		Created,
		InWork,
		Finished
	}
}
