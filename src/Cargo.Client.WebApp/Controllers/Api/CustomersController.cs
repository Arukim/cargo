using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Cargo.Client.Logic;
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

        [HttpGet()]
        public async Task<List<Customer>> Get()
        {
            return await ctx.Customers
                .OrderBy(x => x.Name)
                .ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<Customer> Get(int id)
        {
            return await ctx.Customers
                    .Include(x => x.Parts)
                    .FirstOrDefaultAsync(x => x.Id == id);
        }

        [HttpPost("{custId}/[action]")]
        [RequestSizeLimit(100_000_000)]
        public async Task<IActionResult> CreatePart(int custId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Content("file not selected");

            var cust = await ctx.Customers
                .FirstOrDefaultAsync(c => c.Id == custId);

            if (cust == null)
                return BadRequest("no such customer");

            var path = PathBuilder.GetPartDirectory(cust);
            Directory.CreateDirectory(path);

            var part = new Part { Name = file.FileName };
            cust.Parts = new List<Part>();
            cust.Parts.Add(part);
            await ctx.SaveChangesAsync();
            var filename = $"{part.Id}_{file.FileName}";
            var filePath = Path.Combine(path, filename);
            
            using (var stream = new FileStream(filePath, FileMode.CreateNew))
            {
                await file.CopyToAsync(stream);
            }

            part.Name = file.FileName;
            part.Filename = filename;
            await ctx.SaveChangesAsync();

            return Created("", new { Id = part.Id });
        }
    }   
}