using Caterflow.BLL.DTOs.AuthenticationDTOs;
using Caterflow.BLL.Services;
using CaterFlow.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CaterFlow.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenService _tokenService;

        public RegisterController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<Token>> Register([FromBody] RegisterUser value)
        {
            var user = new User { UserName = value.Email, Email = value.Email };
            var createUserResult = await _userManager.CreateAsync(user, value.Password);

            if (createUserResult.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok(new Token { TokenString = _tokenService.GenerateToken(user) });
            }   
            var errorMessage = string.Join(" ", createUserResult.Errors
                .Select(e => e.Description)
                .Where(s => !(s.StartsWith("Username") && s.EndsWith("is already taken."))));
            return Conflict(errorMessage);
        }
    }
}
