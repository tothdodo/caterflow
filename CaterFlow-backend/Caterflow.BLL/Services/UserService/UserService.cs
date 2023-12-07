using Caterflow.BLL.DTOs.CateringUnitDTOs;
using Caterflow.BLL.DTOs.UserDTOs;
using CaterFlow.DAL;
using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Caterflow.BLL.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly CaterFlowDbContext _dbContext;
        private readonly TokenService _tokenService;
        public UserService(CaterFlowDbContext dbContext, TokenService tokenService)
        {
            _dbContext = dbContext;
            _tokenService = tokenService;
        }

        public async Task<List<CateringUnitListItem>> GetCateringUnitsForUser(int userId)
        {
            return await _dbContext.Users
                .Where(u => u.Id == userId)
                .Include(u => u.CateringUnitUsers)
                    .ThenInclude(cuu => cuu.CateringUnit)
                .SelectMany(u => u.CateringUnitUsers)
                .Select(cuu => new CateringUnitListItem
                {
                    Id = cuu.CateringUnit.Id,
                    Name = cuu.CateringUnit.Name
                })
                .ToListAsync();
        }

        public async Task<UserUnitInfo> GetUsersUnitInfo(int userId, int cateringUnitId)
        {
            var unitUser = await _dbContext.CateringUnits.Where(cu => cu.Id == cateringUnitId)
                .SelectMany(cu => cu.CateringUnitUsers)
                .Where(cuu => cuu.UserId == userId)
                .FirstOrDefaultAsync();

            var user = await _dbContext.Users.Include(u => u.CateringUnitUsers).FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new Exception("User not found");

            return new UserUnitInfo
            {
                NickName = unitUser?.NickName ?? "",
                TokenString = _tokenService.GenerateToken(user)
            };
        }

        public async Task<User?> GetUser(string email)
        {
            return await _dbContext.Users.Include(u => u.CateringUnitUsers).FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
