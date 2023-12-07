using CaterFlow.DAL.Entities;
using Newtonsoft.Json;

namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class PaySubOrderItems
    {
        public int CateringUnitId { get; set; }
        public int OrderId { get; set; }

        public List<PaySubOrderItem> SubOrderItemIds { get; set; }

        public PaySubOrderItems()
        {
            SubOrderItemIds = new List<PaySubOrderItem>();
        }
    }

    public class PaySubOrderItem
    {
        public int SubOrderItemId { get; set; }
        public int Amount { get; set; }
    }
}
