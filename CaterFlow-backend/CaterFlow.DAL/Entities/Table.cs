namespace CaterFlow.DAL.Entities
{
    public class Table
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public CateringUnit CateringUnit { get; set; } = null!;
        public int CateringUnitId { get; set; }
    }
}
