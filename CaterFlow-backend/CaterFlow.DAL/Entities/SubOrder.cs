namespace CaterFlow.DAL.Entities
{
    public class SubOrder
    {
        public int Id { get; set; }
        public SubOrderStatus DrinkStatus { get; set; }
        public SubOrderStatus KitchenStatus { get; set; }
        public string WaiterName { get; set; } = null!;
        public ICollection<SubOrderItem> SubOrderItems { get; set; }
        public DateTime Date { get; set; }
        public DiningOption DiningOption { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public SubOrder()
        {
            SubOrderItems = new HashSet<SubOrderItem>();
        }
    }
}
