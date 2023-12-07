using Caterflow.BLL.DTOs.ProductDTOs;

namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class CreateSubOrderItem
    {
        public int Id { get; set; }
        public ProductInOrder Product { get; set; } = null!;
        public int Amount { get; set; }
    }
}
