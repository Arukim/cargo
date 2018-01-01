using Cargo.Client.Persisting;
using Cargo.Client.Persisting.Entity;
using Cargo.Client.Terminal.Helpers;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace Cargo.Client.Terminal.Components.Orders
{
    public class OrdersViewModel : BaseViewModel
    {
        public OrdersViewModel()
        {
            using (var ctx = new CargoDbContext())
            {
                Orders = ctx.Orders
                    .Include("OrderParts.Part")
                    .ToList()
                    .Select(x => new OrderViewModel(x))
                    .ToList();
            }
        }

        public List<OrderViewModel> Orders { get; set; }
    }

    public class OrderViewModel
    {
        private Order order;
        public OrderViewModel(Order order)
        {
            this.order = order;
            this.OrderParts = this.order.OrderParts
                    .Select(x => new OrderPartViewModel(x))
                    .ToList();
        }

        public string Name => order.Name;

        public List<OrderPartViewModel> OrderParts { get; set; }
    }

    public class OrderPartViewModel
    {
        private OrderPart value;
        public OrderPartViewModel(OrderPart op)
        {
            value = op;
        }

        public string Name => value.Part.Name;        
    }
}
