using Caterflow.BLL.DTOs.IngredientDTOs;

namespace Caterflow.BLL.DTOs.ProductDTOs
{
    public class ProductIngredients
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public List<IngredientPlusable> Ingredients { get; set; }

        public ProductIngredients()
        {
            Ingredients = new List<IngredientPlusable>();
        }
    }
}
