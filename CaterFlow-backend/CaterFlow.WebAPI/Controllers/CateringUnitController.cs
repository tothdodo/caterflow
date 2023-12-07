using Caterflow.BLL.DTOs.CateringUnitDTOs;
using Caterflow.BLL.DTOs.UserDTOs;
using Caterflow.BLL.Services.CateringUnitService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CaterFlow.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CateringUnitController : ControllerBase
    {
        private readonly ICateringUnitService _cateringUnitService;

        public CateringUnitController(ICateringUnitService cateringUnitService)
        {
            _cateringUnitService = cateringUnitService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CateringUnitDTO>>> Get([FromQuery]int userId)
        {
            return await _cateringUnitService.GetCateringUnits(userId);
        }

        [HttpGet("{unitId}")]
        public async Task<ActionResult<CateringUnitDTO>> GetByUnitId(int unitId)
        {
            var unit = await _cateringUnitService.GetCateringUnitById(unitId);
            if (unit == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(unit);
            }
        }

        [HttpGet("unit-details/{unitId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UnitDetails>> GetEntryCodeByUnitId(int unitId)
        {
            var unit = await _cateringUnitService.GetEntryCodeByUnitId(unitId);
            return Ok(unit);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CateringUnitDTO>> Post(CreateCateringUnitDTO value)
        {
            try
            {
                var insertedValue = await _cateringUnitService.InsertCateringUnit(value);
                return insertedValue != null
                ? CreatedAtAction(nameof(Get), new { unitId = insertedValue.Id }, insertedValue)
                : BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CateringUnitUserDTO>> PutUserIntoUnit(AddUser addUser)
        {
            try
            {
                var addedUser = await _cateringUnitService.AddUnitUser(addUser);
                return Ok(addedUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("users/{unitId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<CateringUnitUserDTO>>> GetUsersOfUnit(int unitId)
        {
            try
            {
                var users = await _cateringUnitService.GetUsersOfUnit(unitId);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("change-role")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CateringUnitUserDTO>> ChangeRoleOfUser(ChangeRole changeRole)
        {
            try
            {
                var changedRole = await _cateringUnitService.ChangeRoleOfUser(changeRole);
                return Ok(changedRole);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
