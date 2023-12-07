using Caterflow.BLL.Services.UserService;
using Caterflow.BLL.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CaterFlow.DAL.Entities;
using Caterflow.BLL.DTOs.AuthenticationDTOs;

namespace CaterFlow.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly SignInManager<User> _signInManager;
        private readonly IUserService _userService;
        private readonly TokenService _tokenService;

        public LoginController(SignInManager<User> signInManager, IUserService userService, TokenService tokenService)
        {
            _signInManager = signInManager;
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost]
        [Route("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Token>> Login([FromBody] Login value)
        {
            var user = await _userService.GetUser(value.Email);
            if (user == null)
                return BadRequest("Email is not valid.");
            var result = await _signInManager.CheckPasswordSignInAsync(user, value.Password, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                return Ok(new Token { TokenString = _tokenService.GenerateToken(user) });
            }

            return Unauthorized();
        }
    }
}
