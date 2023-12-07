using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.IngredientDTOs
{
    public class CreateIngredient
    {
        public string Name { get; set; } = null!;
        public string ContainType { get; set; } = null!;
        public bool Plusable { get; set; }
        public float? PlusPrice { get; set; }
    }
}
