using CaterFlow.DAL.Entities;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Caterflow.BLL.Services
{
    public class TokenService
    {
        public string GenerateToken(User user)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("CaterFlowSecretKeyHopesLongEnoughForMeSoNotGettingError"));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim("UserId", user.Id.ToString())
            };

            var cateringUnitUserClaims = new
            {
                CateringUnitUsers = user.CateringUnitUsers.Select(cu => new
                {
                    cu.CateringUnitId,
                    cu.Role
                })
            };

            claims.Add(new Claim("CateringUnitUserData", JsonConvert.SerializeObject(cateringUnitUserClaims)));

            var tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:7251",
                audience: "http://localhost:7251",
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }
}
