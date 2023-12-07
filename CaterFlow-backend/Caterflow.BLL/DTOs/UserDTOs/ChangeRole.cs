using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.UserDTOs
{
    public class ChangeRole
    {
        public int UserId { get; set; }
        public int CateringUnitId { get; set; }
        public Role Role { get; set; }
    }
}
