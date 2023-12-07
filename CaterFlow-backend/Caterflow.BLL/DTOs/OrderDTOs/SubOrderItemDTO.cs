using Caterflow.BLL.DTOs.ProductDTOs;
using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class SubOrderItemDTO
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int AmountToPay { get; set; }
        public SubOrderItemProduct Product { get; set; } = null!;
    }
}
