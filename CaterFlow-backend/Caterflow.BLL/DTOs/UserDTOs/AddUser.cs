namespace Caterflow.BLL.DTOs.UserDTOs
{
    public class AddUser
    {
        public int UserId { get; set; }
        public int EntryCode { get; set; }
        public string NickName { get; set; } = null!;
    }
}
