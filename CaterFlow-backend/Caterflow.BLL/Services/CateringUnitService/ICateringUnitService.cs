using Caterflow.BLL.DTOs.CateringUnitDTOs;
using Caterflow.BLL.DTOs.UserDTOs;

namespace Caterflow.BLL.Services.CateringUnitService
{
    public interface ICateringUnitService
    {
        public Task<List<CateringUnitDTO>> GetCateringUnits(int userId);
        public Task<CateringUnitDTO?> GetCateringUnitById(int id);
        public Task<CateringUnitDTO?> InsertCateringUnit(CreateCateringUnitDTO newUnit);
        public Task<CateringUnitUserDTO> AddUnitUser(AddUser addUser);
        public Task<UnitDetails?> GetEntryCodeByUnitId(int unitId);
        public Task<CateringUnitUserDTO> ChangeRoleOfUser(ChangeRole changeRole);

        public Task<List<CateringUnitUserDTO>> GetUsersOfUnit(int unitId);
    }
}
