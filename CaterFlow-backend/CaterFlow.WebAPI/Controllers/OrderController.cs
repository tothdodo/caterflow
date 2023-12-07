using Caterflow.BLL.DTOs.OrderDTOs;
using Caterflow.BLL.Services.OrderService;
using CaterFlow.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CaterFlow.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDTO>> GetOrderById([FromQuery] GetOrder order)
        {
            var result = await _orderService.GetOrderByIds(order);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet]
        [Route("active")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ActiveOrders>> GetActiveOrders([FromQuery] int cateringUnitId, [FromQuery] string waiterName)
        {
            try
            {
                var result = await _orderService.GetActiveOrders(cateringUnitId, waiterName);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("payable")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OrderPay>> GetUnPaidOrderItems([FromQuery] GetOrder order)
        {
            try
            {
                var result = await _orderService.GetUnPaidOrderItems(order);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("suborders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<SubOrderDTO>>> GetActiveSubOrders([FromQuery] int cateringUnitId, [FromQuery] ProductCreationPlace place)
        {
            try
            {
                var result = await _orderService.GetActiveSubOrders(cateringUnitId, place);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("suborders")]
        public async Task<ActionResult<Order>> AddSubOrder(CreateSubOrder subOrder)
        {
            try
            {
                var updatedOrder = await _orderService.AddSubOrder(subOrder);
                return Ok(updatedOrder);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDTO>> CreateOrder([FromBody] CreateOrder order)
        {
            try
            {
                var createdOrder = await _orderService.CreateOrder(order);
                return Ok(createdOrder);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("served")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> SetOrderServed([FromBody] GetOrder getOrder)
        {
            try
            {
                var result = await _orderService.SetOrderServed(getOrder);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("suborders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Order>> ModifySubOrder(ModifySubOrder subOrder)
        {
            try
            {
                var updatedOrder = await _orderService.ModifySubOrder(subOrder);
                return Ok(updatedOrder);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("suborders/state")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SubOrderDTO>> UpdateSubOrderState(UpdateSubOrderState updateState)
        {
            try
            {
                var result = await _orderService.UpdateSubOrderState(updateState);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("payment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OrderDTO>> UpdateOrderPayment([FromBody]PaySubOrderItems updatePayment)
        {
            try
            {
                var result = await _orderService.PaySubOrderItems(updatePayment);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
