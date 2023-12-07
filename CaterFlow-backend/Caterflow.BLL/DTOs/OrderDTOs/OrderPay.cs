namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class OrderPay
    {
        public ICollection<SubOrderItemDTO> SubOrderItems { get; set; }

        public OrderPay()
        {
            SubOrderItems = new List<SubOrderItemDTO>();
        }
    }
}
