using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Cargo.Client.Persisting;
using Cargo.Client.Persisting.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cargo.Client.WebApp.Controllers.Api
{
	[Produces("application/json")]
	[Route("api/OrderParts")]
	public class OrderPartsController : Controller
	{
		private readonly CargoContext ctx;
		private readonly IMapper mapper;

		public OrderPartsController(CargoContext ctx, IMapper mapper)
		{
			this.ctx = ctx;
			this.mapper = mapper;
		}

		[HttpPost("[action]")]
		public async Task<IEnumerable<OrderPartModel>> Query([FromBody] GetSomeRequest req)
		{
			var res = await ctx.OrderParts
				.Include(x => x.Part)
				.Include(x => x.Order)
					.ThenInclude(x => x.Customer)
				.Where(x => req.OrderPartIds.Contains(x.Id))
				.ToListAsync();
			return mapper.Map<IEnumerable<OrderPartModel>>(res);
		}

		[HttpPut("{partId}/successfulBatch/{batchId}")]
		public async Task<IActionResult> PutSuccessfulBatch(int partId, int batchId)
		{
			var batch = await ctx.Batches.FirstOrDefaultAsync(x => x.Id == batchId);
			if (batch == null)
				return BadRequest("no such batch");

			var orderPart = await ctx.OrderParts.FirstOrDefaultAsync(x => x.Id == partId);
			if (orderPart == null)
				return BadRequest("no such part");

			orderPart.SuccessfulBatch = batch;

			orderPart.Status = OrderPartStatus.Finished;

			await ctx.SaveChangesAsync();

			return Ok();
		}

		[HttpPut("{partId}/failed")]
		public async Task<IActionResult> FailedDetail(int partId)
		{
			var orderPart = await ctx.OrderParts.FirstOrDefaultAsync(x => x.Id == partId);
			if (orderPart == null)
				return BadRequest("no such part");

			orderPart.Status = OrderPartStatus.Created;

			await ctx.SaveChangesAsync();

			return Ok();
		}
	}

	public class OrderPartsMappingProfile : Profile
	{
		public OrderPartsMappingProfile()
		{
			CreateMap<OrderPart, OrderPartModel>()
				.ForMember(dst => dst.Order, opt => opt.MapFrom(src => src.Order.Name))
				.ForMember(dst => dst.Customer, opt => opt.MapFrom(src => src.Order.Customer.Name))
				.ForMember(dst => dst.Part, opt => opt.MapFrom(src => src.Part.Name));
		}
	}

	public class GetSomeRequest
	{
		public List<int> OrderPartIds { get; set; }
	}

	public class OrderPartModel
	{
		public int Id { get; set; }
		public string Order { get; set; }
		public string Customer { get; set; }
		public string Part { get; set; }
	}
}