using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.WindowsServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Cargo.Client.WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var exePath = Process.GetCurrentProcess().MainModule.FileName;
            var directoryPath = Path.GetDirectoryName(exePath);


            if (Debugger.IsAttached || args.Contains("--debug"))
            {
                BuildWebHost(args).Run();
            }
            else
            {
                var host = BuildWebHostService(args, directoryPath);
                host.RunAsService();
            }

        }

        public static IWebHost BuildWebHostService(string[] args, string contentRoot) =>
            WebHost.CreateDefaultBuilder(args)
                .UseContentRoot(contentRoot)
                .UseStartup<Startup>()
                .Build();

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();

    }
}