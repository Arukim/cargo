using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.MagicsProxy
{
    public class MagicsProxy : IMagicsProxy
    {
        public MagicsStatus GetStatus()
        {
            var pname = Process.GetProcessesByName("Magics");
            if (!pname.Any())
            {
                return new MagicsStatus
                {
                    IsConnected = false
                };
            }

            return new MagicsStatus
            {
                IsConnected = true
            };
        }
    }
}
