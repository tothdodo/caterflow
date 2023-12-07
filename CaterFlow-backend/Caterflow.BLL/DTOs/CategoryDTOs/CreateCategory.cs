namespace Caterflow.BLL.DTOs.CategoryDTOs
{
    public class CreateCategory
    {
        public string Name { get; set; } = null!;
        public int CateringUnitId { get; set; }
    }
}
