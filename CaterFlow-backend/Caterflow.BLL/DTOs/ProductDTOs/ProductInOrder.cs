using Caterflow.BLL.DTOs.IngredientDTOs;

namespace Caterflow.BLL.DTOs.ProductDTOs
{
    public class ProductInOrder
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public ICollection<IngredientContain> Ingredients { get; set; }

        public ProductInOrder()
        {
            Ingredients = new HashSet<IngredientContain>();
        }
    }
}
