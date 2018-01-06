using Cargo.Client.Logic;
using Cargo.Client.Persisting.Entities;
using Magics;
using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;

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
                var status = ReadStatus(magics);

                magics.SetModelProperty(status.ModelsCount - 1, "StlName", StlName(orderPart));

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

        public MagicsStatus Save(Batch batch)
        {
            var magics = new ApplicationMagics();
            try
            {
                Directory.CreateDirectory(PathBuilder.GetBatchDirectory());
                magics.SavePlatform(@"C:\temp\test.magics");
                return ReadStatus(magics);
            }
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }

        protected string StlName(OrderPart op)
        {
            return $"{op.Id}_{op.Part.Filename}";
        }

        protected MagicsStatus ReadStatus(ApplicationMagics magics)
        {
            var vol = magics.GetPlatformProperty("VolumeMM");
            var volume = Double.Parse(vol, CultureInfo.InvariantCulture.NumberFormat);
            var numOfStl = Int32.Parse(magics.GetPlatformProperty("NumOfStl"));

            return new MagicsStatus
            {
                ModelsCount = numOfStl,
                ModelsVolume = volume
            };
        }
    }
}
