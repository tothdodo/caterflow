using Caterflow.BLL.DTOs.CategoryDTOs;
using Caterflow.BLL.DTOs.IngredientDTOs;
using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.ProductDTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public float Price { get; set; }
        public ProductCreationPlace CreationPlace { get; set; }
        public CategoryDTO Category { get; set; } = null!;
        public int CategoryId { get; set; }
        public ICollection<IngredientDTO> Ingredients { get; set; }

        public ProductDTO()
        {
            Ingredients = new HashSet<IngredientDTO>();
        }
    }
}
