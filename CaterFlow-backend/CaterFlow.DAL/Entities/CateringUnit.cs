namespace CaterFlow.DAL.Entities
{
    public class CateringUnit
    {
        public CateringUnit()
        {
            CateringUnitUsers = new HashSet<CateringUnitUser>();
            Tables = new HashSet<Table>();
            Products = new HashSet<Product>();
            Categories = new HashSet<Category>();
            Orders = new HashSet<Order>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public int EntryCode { get; set; }

        public virtual ICollection<Table> Tables { get; set; }

        public virtual ICollection<CateringUnitUser> CateringUnitUsers { get; set; }

        public virtual ICollection<Product> Products { get; set; }

        public virtual ICollection<Category> Categories { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
