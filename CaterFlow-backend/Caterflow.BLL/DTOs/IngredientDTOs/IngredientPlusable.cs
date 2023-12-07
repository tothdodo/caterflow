namespace Caterflow.BLL.DTOs.IngredientDTOs
{
    public class IngredientPlusable
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool Plusable { get; set; }
    }
}
