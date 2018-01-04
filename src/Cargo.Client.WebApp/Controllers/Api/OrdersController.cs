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
                    .ThenInclude(op => op.Part);

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
    }
}