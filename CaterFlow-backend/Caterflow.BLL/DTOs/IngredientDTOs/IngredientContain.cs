using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.IngredientDTOs
{
    public class IngredientContain
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool Plusable { get; set; }
        public float PlusPrice { get; set; }
        public ContainType ContainType { get; set; }
    }
}
