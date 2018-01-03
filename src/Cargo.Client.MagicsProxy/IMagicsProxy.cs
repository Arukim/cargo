using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cargo.Client.MagicsProxy
{
    public interface IMagicsProxy
    {
        int AppCount();
        MagicsStatus GetStatus();
    }
}
