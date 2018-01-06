﻿using System;
using System.Collections.Generic;
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
    [Route("api/Batches")]
    public class BatchesController : Controller
    {
        private readonly IMagicsProxy magics;
        private readonly CargoContext ctx;

        public BatchesController(IMagicsProxy magics, CargoContext ctx)
        {
            this.magics = magics;
            this.ctx = ctx;
        }

        [HttpPost()]
        public async Task<IActionResult> Create([FromBody]NewBatch req)
        {
            var ops = ctx.OrderParts.Where(x => req.OrderPartIds.Contains(x.Id)).ToList();

            var batch = new Batch
            {
                Name = req.Name
            };

            ctx.Batches.Add(batch);

            await ctx.SaveChangesAsync();

            ctx.BatchOrderParts.AddRange(ops.Select(op => new BatchOrderPart
            {
                OrderPartId = op.Id,
                BatchId = batch.Id
            }).ToList());

            batch.Filename = PathBuilder.CreateBatchFilename(batch);

            await ctx.SaveChangesAsync();
            magics.Save(batch);
            return Ok(batch.Id);
        }

        [HttpGet()]
        public async Task<List<Batch>> GetBatches()
        {
            return await ctx.Batches.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetBatch(int id)
        {
            var batch = await ctx.Batches
                .Include(x => x.BatchOrderParts)
                .ThenInclude(x => x.OrderPart)
                .ThenInclude(x => x.Part)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (batch == null)
                return BadRequest("no such batch");


            var batchModel = new BatchModel
            {
                Name = batch.Name,
                Id = batch.Id,
                OrderParts = batch.BatchOrderParts.Select(x => x.OrderPart).ToList()
            };

            return Ok(batchModel);
        }
    }

    public class BatchModel : Batch
    {
        public List<OrderPart> OrderParts { get; set; }
    }

    public class NewBatch
    {
        public string Name { get; set; }
        public List<int> OrderPartIds { get; set; }
    }
}