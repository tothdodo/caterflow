namespace CaterFlow.DAL.Entities
{
    public class CateringUnitUser
    {
        public CateringUnit CateringUnit { get; set; } = null!;
        public int CateringUnitId {  get; set; }
        public User User { get; set; } = null!;
        public int UserId { get; set; }
        public string NickName { get; set; } = null!;
        public Role Role { get; set; }
    }
}
