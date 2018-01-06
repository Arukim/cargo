using Cargo.Client.Persisting.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.Logic
{
    public class PathBuilder
    {
        public static string GetPartDirectory(Customer cust)
        {
            return Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/upload", cust.Id.ToString());
        }

        public static string GetPartFile(Part part)
        {
            return Path.Combine(GetPartDirectory(part.Customer), part.Filename);
        }

        public static string GetBatchDirectory()
        {
            return Path.Combine(Directory.GetCurrentDirectory(), "wwwwroot\\upload", "batches");
        }

        public static string CreateBatchFilename(Batch batch)
        {
            return $"{batch.Id}_{batch.Name}.magics";
        }

        public static string GetBatchFile(Batch batch)
        {
            return Path.Combine(GetBatchDirectory(), batch.Filename);
        }
    }
}
