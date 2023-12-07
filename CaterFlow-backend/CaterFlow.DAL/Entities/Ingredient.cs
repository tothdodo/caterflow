namespace CaterFlow.DAL.Entities
{
    public class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool Plusable { get; set; }
        public float? PlusPrice { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}
