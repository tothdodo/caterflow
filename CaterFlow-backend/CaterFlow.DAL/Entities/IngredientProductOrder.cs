namespace CaterFlow.DAL.Entities
{
    public class IngredientProductOrder
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public float? PlusPrice { get; set; }
        public ContainType ContainType { get; set; }
        public int ProductOrderId { get; set; }
    }
}
