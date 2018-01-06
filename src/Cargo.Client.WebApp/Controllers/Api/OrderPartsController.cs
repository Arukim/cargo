using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public OrderPartsController(CargoContext ctx)
        {
            this.ctx = ctx;
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<OrderPart>> Query([FromBody] GetSomeRequest req)
        {
            return await ctx.OrderParts
                .Include(x => x.Part)
                .Include(x => x.Order)
                    .ThenInclude(x => x.Customer)
                .Where(x => req.OrderPartIds.Contains(x.Id))
                .ToListAsync();
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

            await ctx.SaveChangesAsync();

            return Ok();
        }
    }

    public class GetSomeRequest
    {
        public List<int> OrderPartIds { get; set; }
    }
}