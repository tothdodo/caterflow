using Microsoft.AspNetCore.Identity;

namespace CaterFlow.DAL.Entities
{
    public class User : IdentityUser<int>
    {
        public virtual ICollection<CateringUnitUser> CateringUnitUsers { get; set; }

        public User()
        {
            CateringUnitUsers = new HashSet<CateringUnitUser>();
        }
    }
}