namespace CaterFlow.DAL.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public ICollection<Product> Products { get; set; }
        public int CateringUnitId { get; set; }
        public CateringUnit CateringUnit { get; set; } = null!;
        public Category()
        {
            Products = new HashSet<Product>();
        }
    }
}
