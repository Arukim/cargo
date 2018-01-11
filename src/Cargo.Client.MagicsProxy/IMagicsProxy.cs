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
        MagicsStatus LoadParts(IEnumerable<OrderPart> parts);
        MagicsStatus UnloadPart(OrderPart part);
        MagicsStatus UnloadAll();

        void GetInfo(List<Part> parts);
        MagicsStatus Save(Batch batch);
    }
}
