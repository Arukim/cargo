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
    }

    public class GetSomeRequest
    {
        public List<int> OrderPartIds { get; set; }
    }
}