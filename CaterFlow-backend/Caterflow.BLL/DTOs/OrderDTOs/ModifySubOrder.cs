namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class ModifySubOrder
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int CateringUnitId { get; set; }
        public ICollection<ModifySubOrderItem> SubOrderItems { get; set; }
        public ModifySubOrder()
        {
            SubOrderItems = new HashSet<ModifySubOrderItem>();
        }
    }
}
