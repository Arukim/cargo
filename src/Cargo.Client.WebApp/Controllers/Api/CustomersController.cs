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
    [Route("api/Customers")]
    public class CustomersController : Controller
    {
        private readonly CargoContext ctx;
        public CustomersController(CargoContext ctx)
        {
            this.ctx = ctx;
        }

        [HttpGet("{id}")]
        public async Task<Customer> Get(int id)
        {
            return await ctx.Customers
                    .Include(x => x.Parts)
                    .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}