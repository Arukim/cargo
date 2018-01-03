﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cargo.Client.MagicsProxy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cargo.Client.WebApp.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/Magics")]
    public class MagicsController : Controller
    {
        private readonly IMagicsProxy magics;
        public MagicsController(IMagicsProxy magics)
        {
            this.magics = magics;
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
    }
}