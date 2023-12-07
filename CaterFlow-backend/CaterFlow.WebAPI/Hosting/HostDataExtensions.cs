using CaterFlow.DAL.SeedServices;
using Microsoft.EntityFrameworkCore;

namespace CaterFlow.WebAPI.Hosting
{
    public static class HostDataExtensions
    {
        public static async Task<IHost> MigrateDatabase<TContext>(this IHost host) where TContext : DbContext
        {
            using ( var scope = host.Services.CreateScope() )
            {
                var serviceProvider = scope.ServiceProvider;
                var context = serviceProvider.GetRequiredService<TContext>();
                context.Database.Migrate();

                var userSeeder = serviceProvider.GetRequiredService<IUserSeedService>();
                await userSeeder.SeedUserAsync();
            }
            return host;
        }
    }
}
