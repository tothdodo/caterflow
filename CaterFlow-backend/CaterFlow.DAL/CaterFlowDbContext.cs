using CaterFlow.DAL.Entities;
using CaterFlow.DAL.EntityConfigurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CaterFlow.DAL
{
    public class CaterFlowDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public CaterFlowDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<CateringUnit> CateringUnits => Set<CateringUnit>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new CateringUnitUserEntityConfiguration());
            modelBuilder.ApplyConfiguration(new CateringUnitEntityConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryEntityConfiguration());
            modelBuilder.ApplyConfiguration(new ProductEntityConfiguration());
            modelBuilder.ApplyConfiguration(new TableEntityConfiguration());
            modelBuilder.ApplyConfiguration(new IngredientEntityConfiguration());

            modelBuilder.ApplyConfiguration(new IngredientProductOrderEntityConfiguration());
            modelBuilder.ApplyConfiguration(new ProductOrderEntityConfiguration());
            modelBuilder.ApplyConfiguration(new OrderEntityConfiguration());
            modelBuilder.ApplyConfiguration(new SubOrderEntityConfiguration());
            modelBuilder.ApplyConfiguration(new SubOrderItemEntityConfiguration());

        }
    }
}
