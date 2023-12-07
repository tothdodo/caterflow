namespace Caterflow.BLL.DTOs.CateringUnitDTOs
{
    public class CreateCateringUnitDTO
    {
        public string CateringUnitName { get; set; } = null!;
        public int CreatorId { get; set; }
        public string CreatorNickName { get; set; } = null!;
        public int TableCount { get; set; }
    }
}
