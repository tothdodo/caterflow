namespace CaterFlow.DAL.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public float Price { get; set; }
        public ProductCreationPlace CreationPlace { get; set; }
        public Category Category { get; set; } = null!;
        public int CategoryId { get; set; }
        public CateringUnit CateringUnit { get; set; } = null!;
        public int CateringUnitId { get; set; }
        public ICollection<Ingredient> Ingredients { get; set; }

        public Product()
        {
            Ingredients = new HashSet<Ingredient>();
        }
    }
}
