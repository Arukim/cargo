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
        public MagicsStatus GetStatus()
        {
            var pname = Process.GetProcessesByName("Magics");
            var procs = pname.Count();
            if (procs == 0)
                return new MagicsStatus
                {
                    State = "OFFLINE"
                };

            if (procs > 1)
                return new MagicsStatus
                {
                    State = "MANY"
                };


            var magics = new ApplicationMagics();
            try
            {
                var vol = magics.GetPlatformProperty("VolumeMM");
                var volume = Double.Parse(vol, CultureInfo.InvariantCulture.NumberFormat);
                var numOfStl = Int32.Parse(magics.GetPlatformProperty("NumOfStl"));

                return new MagicsStatus
                {
                    State = "OK",
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
