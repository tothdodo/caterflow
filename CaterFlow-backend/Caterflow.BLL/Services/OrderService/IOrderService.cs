using Caterflow.BLL.DTOs.OrderDTOs;
using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.Services.OrderService
{
    public interface IOrderService
    {
        Task<OrderDTO?> GetOrderByIds(GetOrder order);
        Task<OrderDTO> CreateOrder(CreateOrder order);
        Task<OrderDTO> AddSubOrder(CreateSubOrder subOrder);
        Task<ActiveOrders> GetActiveOrders(int cateringUnitId, string waiterName);
        Task<OrderDTO> ModifySubOrder(ModifySubOrder subOrder);
        Task<List<SubOrderDTO>> GetActiveSubOrders(int cateringUnitId, ProductCreationPlace place);
        Task<SubOrderDTO> UpdateSubOrderState(UpdateSubOrderState updateState);
        Task<bool> SetOrderServed(GetOrder getOrder);
        Task<OrderDTO> PaySubOrderItems(PaySubOrderItems paySubOrderItems);
        Task<OrderPay> GetUnPaidOrderItems(GetOrder order);
    }
}
