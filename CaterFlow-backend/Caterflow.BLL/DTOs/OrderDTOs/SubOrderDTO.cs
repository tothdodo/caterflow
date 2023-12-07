using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class SubOrderDTO
    {
        public int Id { get; set; }
        public SubOrderStatus DrinkStatus { get; set; }
        public SubOrderStatus KitchenStatus { get; set; }
        public ICollection<SubOrderItemDTO> SubOrderItems { get; set; }
        public DateTime Date { get; set; }

        public string WaiterName { get; set; } = null!;
        public DiningOption DiningOption { get; set; }

        public SubOrderDTO()
        {
            SubOrderItems = new HashSet<SubOrderItemDTO>();
        }
    }
}
