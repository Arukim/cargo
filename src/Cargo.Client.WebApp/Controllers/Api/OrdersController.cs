using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cargo.Client.Persisting;
using Cargo.Client.Persisting.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cargo.Client.WebApp.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/Orders")]
    public class OrdersController : Controller
    {
        private readonly CargoContext ctx;
        public OrdersController(CargoContext ctx)
        {
            this.ctx = ctx;
        }

        public IQueryable<Order> Orders => ctx.Orders
            .Include(x => x.Customer)
            .Include(x => x.OrderParts)
                .ThenInclude(op => op.Part)
                    .ThenInclude(p => p.PartInfo)
            .Include(x => x.OrderParts)
                .ThenInclude(op => op.BatchOrderParts)
            .OrderByDescending(x => x.Id);

        [HttpGet]
        public async Task<IEnumerable<Order>> GetAll()
        {
            return await Orders.ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<Order> Get(int id)
        {
            return await Orders.FirstOrDefaultAsync(x => x.Id == id);
        }

        [HttpPost("{orderId}/changeStatus")]
        public async Task<IActionResult> ChangeStatus(int orderId, [FromBody] OrderStatus newStatus)
        {
            var order = await ctx.Orders
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
                return BadRequest($"no order with id:{orderId} exists");

            order.Status = newStatus;

            await ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{orderId}/OrderParts/{partId}/{count}")]
        public async Task<IActionResult> AddOrderParts(int orderId, int partId, int count)
        {
            if (count < 0)
                return BadRequest($"count value of {count} is illegal");

            var order = await Orders
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
                return BadRequest($"no order with id:{orderId} exists");

            var part = await ctx.Parts.FirstOrDefaultAsync(x => x.Id == partId);

            if (part == null)
                return BadRequest($"no part with id:{partId} exists");

            var newOrderParts = Enumerable.Range(0, count)
                .Select(x => new OrderPart
                {
                    Part = part,
                    Order = order,
                    BatchOrderParts = new List<BatchOrderPart> { }
                }).ToList();

            ctx.OrderParts.AddRange(newOrderParts);

            await ctx.SaveChangesAsync();

            return Ok(newOrderParts);
        }

        [HttpDelete("{orderId}")]
        public async Task<IActionResult> RemoveOrder(int orderId)
        {
            var order = await ctx.Orders
                .Include(x => x.OrderParts)
                .FirstOrDefaultAsync(x => x.Id == orderId);
            if(order == null)
                return BadRequest($"no order with id:{orderId} exists");

            foreach (var p in order.OrderParts.ToList())
            {
                ctx.OrderParts.Remove(p);
            }
            await ctx.SaveChangesAsync();

            ctx.Orders.Remove(order);

            await ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{orderId}/orderParts")]
        public async Task<IActionResult> RemoveOrderParts(int orderId,
            [FromBody] RemoveOrderParts request)
        {
            var order = await ctx.Orders
                .Include(x => x.OrderParts)
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
                return BadRequest($"no order with id:{orderId} exists");

            var toRemove = order.OrderParts
                .Where(x => request.OrderPartsIds.Contains(x.Id))
                .ToList();

            ctx.OrderParts.RemoveRange(toRemove);

            await ctx.SaveChangesAsync();

            return Ok();
        }
    }


    public class RemoveOrderParts
    {
        public List<int> OrderPartsIds { get; set; }
    }
}