using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int? TableNumber { get; set; }
        public float? FullPrice { get; set; }
        public OrderStatus Status { get; set; }
        public ICollection<SubOrderDTO> SubOrders { get; set; }

        public OrderDTO()
        {
            SubOrders = new HashSet<SubOrderDTO>();
        }
    }
}
