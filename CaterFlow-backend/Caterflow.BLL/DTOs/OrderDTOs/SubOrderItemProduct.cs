using Caterflow.BLL.DTOs.IngredientDTOs;

namespace Caterflow.BLL.DTOs.OrderDTOs
{
    public class SubOrderItemProduct
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public float Price { get; set; }
        public int ProductId { get; set; }

        public ICollection<IngredientDTO> Ingredients { get; set; }

        public SubOrderItemProduct() 
        {
            Ingredients = new HashSet<IngredientDTO>();
        }
    }
}
