using Cargo.Client.Persisting.Entities;
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
        MagicsStatus LoadPart(OrderPart part);
        MagicsStatus UnloadPart(OrderPart part);
        MagicsStatus Save(Batch batch);
    }
}
