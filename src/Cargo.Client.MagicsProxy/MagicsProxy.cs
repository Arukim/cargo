using Cargo.Client.Logic;
using Cargo.Client.Persisting.Entities;
using Magics;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;

namespace Cargo.Client.MagicsProxy
{
    public class MagicsProxy : IMagicsProxy
    {
        public int AppCount()
        {
            var now = DateTime.Now;
            return Process.GetProcessesByName("Magics").Where(p => now.Subtract(p.StartTime).TotalSeconds > 5).Count();
        }

        public MagicsStatus GetStatus()
        {
            var magics = new ApplicationMagics();
            try
            {
                return ReadStatus(magics);
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }

        public MagicsStatus LoadPart(OrderPart orderPart)
        {
            var magics = new ApplicationMagics();
            try
            {
                magics.LoadSTLPart(PathBuilder.GetPartFile(orderPart.Part));
                var numOfStl = Int32.Parse(magics.GetPlatformProperty("NumOfStl"));

                magics.SetModelProperty(numOfStl - 1, "StlName", StlName(orderPart));

                return ReadStatus(magics);
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }

        public MagicsStatus LoadParts(IEnumerable<OrderPart> parts)
        {
            var magics = new ApplicationMagics();
            try
            {
                foreach (var orderPart in parts)
                {
                    magics.LoadSTLPart(PathBuilder.GetPartFile(orderPart.Part));

                    var numOfStl = Int32.Parse(magics.GetPlatformProperty("NumOfStl"));
                    magics.SetModelProperty(numOfStl - 1, "StlName", StlName(orderPart));
                }
                return ReadStatus(magics);
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }

        public MagicsStatus UnloadPart(OrderPart orderPart)
        {
            var magics = new ApplicationMagics();
            try
            {
                var status = ReadStatus(magics);
                var name = StlName(orderPart);

                for (int i = 0; i < status.ModelsCount; i++)
                {
                    if (name == magics.GetModelProperty(i, "StlName"))
                    {
                        magics.UnloadModel(i);
                        break;
                    }
                }

                return ReadStatus(magics);
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }

        public MagicsStatus UnloadAll()
        {
            var magics = new ApplicationMagics();
            try
            {
                while (Int32.Parse(magics.GetPlatformProperty("NumOfStl")) > 0)
                {
                    magics.UnloadModel(0);
                }

                return ReadStatus(magics);
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }

        public void GetInfo(IEnumerable<Part> parts)
        {
            var magics = new ApplicationMagics();
            try
            {
                foreach (var part in parts)
                {
                    magics.LoadSTLPart(PathBuilder.GetPartFile(part));

                    var model = Int32.Parse(magics.GetPlatformProperty("NumOfStl")) - 1;


                    var pi = part.PartInfo;

                    Func<string, double> getDouble = (str) =>
                    {
                        var v = magics.GetModelProperty(model, str);
                        return Double.Parse(v, CultureInfo.InvariantCulture.NumberFormat);
                    };

                    pi.X = getDouble("StlDimXmm");
                    pi.Y = getDouble("StlDimXmm");
                    pi.Z = getDouble("StlDimXmm");
                    pi.Volume = getDouble("StlVolumeMM");
                    pi.SurfaceArea = getDouble("StlSurfaceAreaMM");

                    magics.UnloadModel(model);
                }
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }

        }

        public MagicsStatus Save(Batch batch)
        {
            var magics = new ApplicationMagics();
            try
            {
                Directory.CreateDirectory(PathBuilder.GetBatchDirectory());
                magics.SaveProject(@"C:\temp\test.magics");
                return ReadStatus(magics);
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }

        public MagicsStatus SaveAllModels(IEnumerable<OrderPart> parts)
        {
            var magics = new ApplicationMagics();
            try
            {
                var numOfStl = Int32.Parse(magics.GetPlatformProperty("NumOfStl"));

                for (int i = 0; i < numOfStl; i++)
                {
                    var name = magics.GetModelProperty(i, "StlName");
                    var match = fileReg.Match(name);

                    var partNum = Int32.Parse(match.Groups[1].Value);

                    var op = parts.FirstOrDefault(x => x.Id == partNum);

                    if (op != null)
                    {
                        var res = magics.SaveModelStl(i, PathBuilder.GetPartFile(op.Part));
                    }
                }

                return ReadStatus(magics);
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }

        protected string StlName(OrderPart op)
        {
            return $"{op.Part.Filename}-{op.Id}";
        }

        private readonly Regex fileReg = new Regex(".*-(\\d*)$", RegexOptions.Compiled);
        protected MagicsStatus ReadStatus(ApplicationMagics magics)
        {
            var vol = magics.GetPlatformProperty("VolumeMM");
            var volume = Double.Parse(vol, CultureInfo.InvariantCulture.NumberFormat);
            var numOfStl = Int32.Parse(magics.GetPlatformProperty("NumOfStl"));

            var partList = new List<int> { };
            for (int i = 0; i < numOfStl; i++)
            {
                var name = magics.GetModelProperty(i, "StlName");
                var match = fileReg.Match(name);
                if (match.Success)
                {
                    partList.Add(Int32.Parse(match.Groups[1].Value));
                }
            }

            return new MagicsStatus
            {
                ModelsCount = numOfStl,
                ModelsVolume = volume,
                OrderParts = partList
            };
        }
    }
}
