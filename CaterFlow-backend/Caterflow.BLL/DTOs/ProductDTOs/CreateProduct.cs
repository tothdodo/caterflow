using Caterflow.BLL.DTOs.IngredientDTOs;
using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.ProductDTOs
{
    public class CreateProduct
    {
        public string Name { get; set; } = null!;
        public float Price { get; set; }
        public int CategoryId { get; set; }
        public ProductCreationPlace CreationPlace { get; set; }
        public ICollection<CreateIngredient> Ingredients { get; set; }
        public int CateringUnitId { get; set; }

        public CreateProduct()
        {
            Ingredients = new HashSet<CreateIngredient>();
        }
    }
}
