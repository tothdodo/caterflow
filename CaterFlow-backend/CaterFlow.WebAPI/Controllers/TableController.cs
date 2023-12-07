using Caterflow.BLL.DTOs.CateringUnitDTOs;
using Caterflow.BLL.Services.TableService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CaterFlow.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TableController : ControllerBase
    {
        private readonly ITableService _tableService;

        public TableController(ITableService tableService)
        {
            _tableService = tableService;
        }

        [HttpGet]
        [Route("{cateringUnitId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<int>> GetTablesByCateringUnitId(int cateringUnitId)
        {
            try
            {
                var result = await _tableService.GetTablesByCateringUnitId(cateringUnitId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TableCateringUnitDTO>> SetTablesForCateringUnit(TableCateringUnitDTO tables)
        {
            try
            {
                var result = await _tableService.SetTablesForCateringUnit(tables);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
