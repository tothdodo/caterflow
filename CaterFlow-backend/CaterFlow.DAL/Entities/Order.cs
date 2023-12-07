namespace CaterFlow.DAL.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public Table? Table { get; set; }
        public int? TableId { get; set; }
        public OrderStatus Status { get; set; }
        public ICollection<SubOrder> SubOrders { get; set; }
        public CateringUnit CateringUnit { get; set; } = null!;
        public int CateringUnitId { get; set; }
        public DateTime Date { get; set; }  

        public Order()
        {
            SubOrders = new HashSet<SubOrder>();
        }
    }
}
