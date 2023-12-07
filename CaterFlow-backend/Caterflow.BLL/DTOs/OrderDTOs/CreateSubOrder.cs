using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class CreateSubOrder
    {
        public int OrderId { get; set; }
        public int CateringUnitId { get; set; }
        public DiningOption DiningOption { get; set; }
        public int UserId { get; set; }
        public ICollection<CreateSubOrderItem> SubOrderItems { get; set; }
        public CreateSubOrder()
        {
            SubOrderItems = new HashSet<CreateSubOrderItem>();
        }
    }
}
