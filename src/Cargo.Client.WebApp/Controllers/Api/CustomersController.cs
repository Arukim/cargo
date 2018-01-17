using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Cargo.Client.Logic;
using Cargo.Client.MagicsProxy;
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
        private readonly IMagicsProxy magics;

        public CustomersController(CargoContext ctx, IMagicsProxy magics)
        {
            this.ctx = ctx;
            this.magics = magics;
        }

        [HttpGet()]
        public async Task<List<Customer>> Get()
        {
            var sortList = await ctx.OrderParts
                .Where(x => x.Status == OrderPartStatus.Created && x.Order.Status == OrderStatus.Confirmed)
                .Select(x => x.Order.CustomerId)
                .GroupBy(x => x)
                .ToDictionaryAsync(g => g.Key, g => g.Count());

            var custs = await ctx.Customers
                .OrderBy(x => x.Name)
                .ToListAsync();

            custs.Sort((a, b) =>
            {
                int v_a = 0, v_b = 0;
                sortList.TryGetValue(a.Id, out v_a);
                sortList.TryGetValue(b.Id, out v_b);
                return v_b - v_a;
            });

            return custs;
        }


    [HttpPost]
    public async Task<IActionResult> AddCustomer([FromBody] Customer cust)
    {
        if (cust == null)
            return BadRequest("no customer received");

        ctx.Customers.Add(cust);

        await ctx.SaveChangesAsync();

        return Ok(cust.Id);
    }


    [HttpGet("{id}")]
    public async Task<Customer> Get(int id)
    {
        return await ctx.Customers
                .FirstOrDefaultAsync(x => x.Id == id);
    }

    [HttpPost("{custId}/loadAll")]
    public async Task<IActionResult> LoadAll(int custId)
    {
        var parts = await ctx.OrderParts
            .Include(x => x.Part)
            .Where(x => x.Order.CustomerId == custId
            && x.Order.Status == OrderStatus.Confirmed
            && x.Status == OrderPartStatus.Created)
            .ToListAsync();


        return Ok(magics.LoadParts(parts));
    }

    [HttpPost("{custId}/orders")]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> CreateOrder(int custId, CreateOrder req)
    {
        var cust = await ctx.Customers
            .FirstOrDefaultAsync(c => c.Id == custId);

        if (cust == null)
            return BadRequest("no such customer");
        cust.Orders = new List<Order>();


        var order = new Order()
        {
            Name = req.Name,
            OrderParts = new List<OrderPart> { },
            Parts = new List<Part> { }
        };

        cust.Orders.Add(order);
        await ctx.SaveChangesAsync();
        var path = PathBuilder.GetPartDirectory(order);

        Directory.CreateDirectory(path);

        var parts = new List<Part>();

        foreach (var file in req.Files)
        {
            var part = new Part { Name = file.FileName, PartInfo = new PartInfo { } };

            order.Parts.Add(part);
            parts.Add(part);

            await ctx.SaveChangesAsync();

            var nameOnly = Path.GetFileNameWithoutExtension(file.FileName);
            var ext = Path.GetExtension(file.FileName);
            var filename = $"{nameOnly}_id_{part.Id}{ext}";
            var filePath = Path.Combine(path, filename);

            using (var stream = new FileStream(filePath, FileMode.CreateNew))
            {
                await file.CopyToAsync(stream);
            }

            part.Filename = filename;

            await ctx.SaveChangesAsync();
        }

        for (var i = 0; i < req.Count.Count; i++)
        {
            for (int j = 0; j < req.Count[i]; j++)
            {
                order.OrderParts.Add(new OrderPart
                {
                    Part = parts[i]
                });
            }
        }
        await ctx.SaveChangesAsync();

        return Ok(order.Id);
    }
}

public class CreateOrder
{
    public string Name { get; set; }
    public List<IFormFile> Files { get; set; }
    public List<int> Count { get; set; }
}
}