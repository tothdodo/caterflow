using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.IngredientDTOs
{
    public class IngredientDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public ContainType ContainType { get; set; }
        public bool Plusable { get; set; }
        public float? PlusPrice { get; set; }
    }
}
