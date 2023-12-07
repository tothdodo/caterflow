namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class ActiveOrders
    {
        public List<OrderHeader> WaiterOrders { get; set; }
        public List<OrderHeader> OtherOrders { get; set; }

        public ActiveOrders()
        {
            WaiterOrders = new List<OrderHeader>();
            OtherOrders = new List<OrderHeader>();
        }
    }
}
