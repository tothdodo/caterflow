using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.CateringUnitDTOs
{
    public class CateringUnitUserDTO
    {
        public int UserId { get; set; }
        public int CateringUnitId { get; set; }
        public string NickName { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public Role Role { get; set; }
        public string? TokenString { get; set; } = null!;
    }
}
