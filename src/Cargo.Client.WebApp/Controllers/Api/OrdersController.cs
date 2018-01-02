using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cargo.Client.Persisting;
using Cargo.Client.Persisting.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cargo.Client.WebApp.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/Orders")]
    public class OrdersController : Controller
    {

        [HttpGet]
        public  IEnumerable<Order> GetAll()
        {
            using(var ctx = new CargoContext())
            {
                return ctx.Orders.ToList();
            }
        }
    }
}