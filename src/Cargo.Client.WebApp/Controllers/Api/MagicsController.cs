using System;
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
    [Route("api/Magics")]
    public class MagicsController : Controller
    {
        private readonly IMagicsProxy magics;
        private readonly CargoContext ctx;

        public MagicsController(IMagicsProxy magics, CargoContext ctx)
        {
            this.magics = magics;
            this.ctx = ctx;
        }

        [HttpGet("[action]")]
        public int AppCount()
        {
            return magics.AppCount();
        }

        [HttpGet("[action]")]
        public MagicsStatus Status()
        {
            return magics.GetStatus();
        }

        [HttpPost("[action]/{id}")]
        public IActionResult Load(int id)
        {
            var op = ctx.OrderParts
                .Include(x => x.Part)
                .FirstOrDefault(x => x.Id == id);

            if (op == null)
                return BadRequest("no such order part");

            return Ok(magics.LoadPart(op));
        }

        [HttpPost("[action]/{id}")]
        public IActionResult Unload(int id)
        {
            var op = ctx.OrderParts
                .Include(x => x.Part)
                .FirstOrDefault(x => x.Id == id);

            if (op == null)
                return BadRequest("no such order part");

            return Ok(magics.UnloadPart(op));
        }
    }
}