using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.HubConfig
{
    public class CateringUnitGroup
    {
        public int CateringUnitId { get; set; }
        public List<HubUser> KitchenUsers { get; set; }
        public List<HubUser> DrinkUsers { get; set; }

        public CateringUnitGroup(int cateringUnitId)
        {
            CateringUnitId = cateringUnitId;
            KitchenUsers = new List<HubUser>();
            DrinkUsers = new List<HubUser>();
        }
    }
}
