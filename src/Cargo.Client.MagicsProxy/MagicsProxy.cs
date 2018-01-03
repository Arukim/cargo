using Magics;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.MagicsProxy
{
    public class MagicsProxy : IMagicsProxy
    {
        public int AppCount()
        {
            return Process.GetProcessesByName("Magics").Count();
        }

        public MagicsStatus GetStatus()
        {
            var magics = new ApplicationMagics();
            try
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
            finally
            {
                Marshal.ReleaseComObject(magics);
            }
        }
    }
}
