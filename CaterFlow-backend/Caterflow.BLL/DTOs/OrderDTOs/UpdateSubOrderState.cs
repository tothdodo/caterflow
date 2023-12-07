using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class UpdateSubOrderState
    {
        public int CateringUnitId { get; set; }
        public int SubOrderId { get; set; }
        public SubOrderStatus NewStatus { get; set; }

        public ProductCreationPlace CreationPlace { get; set; }
    }
}
