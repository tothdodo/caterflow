namespace CaterFlow.DAL.Entities
{
    public class ProductOrder
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public float Price { get; set; }
        public int CategoryId { get; set; }
        public int ProductId { get; set; }

        public ProductCreationPlace CreationPlace { get; set; }

        public ICollection<IngredientProductOrder> Ingredients { get; set;}
        public ProductOrder()
        {
            Ingredients = new HashSet<IngredientProductOrder>();
        }
    }
}
