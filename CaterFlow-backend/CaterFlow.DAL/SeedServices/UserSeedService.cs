using CaterFlow.DAL.Entities;
using Microsoft.AspNetCore.Identity;

namespace CaterFlow.DAL.SeedServices
{
    public class UserSeedService : IUserSeedService
    {
        private readonly UserManager<User> _userManager;
        private readonly CaterFlowDbContext _dbContext;

        public UserSeedService(UserManager<User> userManager, CaterFlowDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        public async Task SeedUserAsync()
        {
            if(await _userManager.FindByNameAsync("admin") == null)
            {
                var adminUser = new User
                {
                    UserName = "admin",
                    Email = "admin@caterflow.hu",
                    SecurityStamp = Guid.NewGuid().ToString(),
                };

                var createResult = await _userManager.CreateAsync(adminUser, "#Admin1234");

                if (!createResult.Succeeded)
                {
                    throw new ApplicationException("Administrator could not be created: " +
                        string.Join(", ", createResult.Errors.Select(e => e.Description)));
                }
                var seedUnit = _dbContext.CateringUnits.FirstOrDefault(cu => cu.Id == 1);
                if (seedUnit != null)
                {
                    seedUnit.CateringUnitUsers.Add(new CateringUnitUser
                    {
                        CateringUnit = seedUnit,
                        User = adminUser,
                        NickName = "Admin Peter"
                    });
                    await _dbContext.SaveChangesAsync();
                }   
            }

            if(await _userManager.FindByNameAsync("waiter") == null)
            {
                var waiterUser = new User
                {
                    UserName = "waiter",
                    Email = "waiter@caterflow.hu",
                    SecurityStamp = Guid.NewGuid().ToString(),
                };

                var createResult2 = await _userManager.CreateAsync(waiterUser, "#Admin1234");

                if (!createResult2.Succeeded)
                {
                    throw new ApplicationException("Waiter could not be created: " +
                        string.Join(", ", createResult2.Errors.Select(e => e.Description)));
                }
            }
            
            if(await _userManager.FindByNameAsync("bot") == null)
            {
                var botUser = new User
                {
                    UserName = "bot",
                    Email = "bot@caterflow.hu",
                    SecurityStamp = Guid.NewGuid().ToString(),
                };

                var createResult3 = await _userManager.CreateAsync(botUser, "#Admin1234");

                if (!createResult3.Succeeded)
                {
                    throw new ApplicationException("Bot could not be created: " +
                        string.Join(", ", createResult3.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}
