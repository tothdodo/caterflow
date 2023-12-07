using Caterflow.BLL.DTOs.CateringUnitDTOs;
using Caterflow.BLL.DTOs.UserDTOs;
using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.Services.UserService
{
    public interface IUserService
    {
        Task<User?> GetUser(string userName);
        Task<List<CateringUnitListItem>> GetCateringUnitsForUser(int userId);
        Task<UserUnitInfo> GetUsersUnitInfo(int userId, int cateringUnitId);
    }
}
