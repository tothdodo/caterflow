using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.UserDTOs
{
    public class UserUnitInfo
    {
        public string NickName { get; set; } = null!;
        public string TokenString { get; set;} = null!;
    }
}
