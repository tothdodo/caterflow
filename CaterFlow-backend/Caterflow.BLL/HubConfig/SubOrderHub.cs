using Caterflow.BLL.HubConfig;
using CaterFlow.DAL;
using CaterFlow.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TicketingSystemBLL.HubConfig
{
    [Authorize]
    public class SubOrderHub : Hub
    {
        private readonly CaterFlowDbContext _dbContext;

        private string CurrentUserId => Context.User.Identities.SelectMany(i => i.Claims).FirstOrDefault(c => c.Type == "UserId")?.Value ?? "";

        private List<CateringUnitGroup> cateringUnits = new List<CateringUnitGroup>();

        public SubOrderHub(CaterFlowDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbContext.CateringUnits.ToList().ForEach(cu => cateringUnits.Add(new CateringUnitGroup(cu.Id)));
        }

        public async Task EnterPlace(int cateringUnitId, ProductCreationPlace place)
        {
            var user = new HubUser
            {
                Id = int.Parse(CurrentUserId),
            };
            var cateringUnit = cateringUnits.FirstOrDefault(cu => cu.CateringUnitId == cateringUnitId) ?? throw new Exception("Catering unit not found.");


            if (place == ProductCreationPlace.Drink)
            {
                cateringUnit.DrinkUsers.Add(user);
                await Groups.AddToGroupAsync(Context.ConnectionId, "Drink" + cateringUnitId.ToString());
            }
            else if (place == ProductCreationPlace.Kitchen)
            {
                cateringUnit.KitchenUsers.Add(user);
                await Groups.AddToGroupAsync(Context.ConnectionId, "Kitchen" + cateringUnitId.ToString());
            }
            else
            {
                throw new Exception("Invalid place.");
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var drinkUser = cateringUnits.SelectMany(cu => cu.DrinkUsers).FirstOrDefault(u => u.Id == int.Parse(CurrentUserId));
            if (drinkUser != null)
            {
                var cateringUnit = cateringUnits.FirstOrDefault(cu => cu.DrinkUsers.Contains(drinkUser)) ?? throw new Exception("Catering unit not found.");
                cateringUnit.DrinkUsers.Remove(drinkUser);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Drink" + cateringUnit.CateringUnitId.ToString());
            }
            else
            {
                var kitchenUser = cateringUnits.SelectMany(cu => cu.KitchenUsers).FirstOrDefault(u => u.Id == int.Parse(CurrentUserId));
                if (kitchenUser != null)
                {
                    var cateringUnit = cateringUnits.FirstOrDefault(cu => cu.KitchenUsers.Contains(kitchenUser)) ?? throw new Exception("Catering unit not found.");
                    cateringUnit.KitchenUsers.Remove(kitchenUser);
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Kitchen" + cateringUnit.CateringUnitId.ToString());
                }
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
