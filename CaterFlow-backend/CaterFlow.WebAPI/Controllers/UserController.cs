using Caterflow.BLL.DTOs.CateringUnitDTOs;
using Caterflow.BLL.DTOs.UserDTOs;
using Caterflow.BLL.Services.UserService;
using CaterFlow.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CaterFlow.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userSerivce)
        {
            _userService = userSerivce;
        }

        [HttpGet("units/{userId}")]
        public async Task<List<CateringUnitListItem>> GetCateringUnitsByUserId(int userId)
        {
            return await _userService.GetCateringUnitsForUser(userId);
        }

        [HttpGet("userunitinfo")]
        public async Task<ActionResult<UserUnitInfo>> GetUsersUnitInfo([FromQuery] int userId, [FromQuery] int cateringUnitId)
        {
            try
            {
                var userinfo = await _userService.GetUsersUnitInfo(userId, cateringUnitId);
                return Ok(userinfo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
