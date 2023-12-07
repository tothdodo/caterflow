namespace CaterFlow.DAL.Entities
{
    public class SubOrderItem
    {
        public int Id { get; set; }
        public float Price { get; set; }
        public int Amount { get; set; }
        public int AmountToPay { get; set; }
        public ProductOrder Product { get; set; } = null!;
        public int ProductId { get; set; }
        public SubOrder SubOrder { get; set; } = null!;
        public int SubOrderId { get; set; }

    }
}
