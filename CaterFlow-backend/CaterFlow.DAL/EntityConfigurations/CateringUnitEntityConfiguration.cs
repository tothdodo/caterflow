using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class CateringUnitEntityConfiguration : IEntityTypeConfiguration<CateringUnit>
    {
        public void Configure(EntityTypeBuilder<CateringUnit> builder)
        {
            builder.Property(e => e.Name);
            builder.Property(e => e.EntryCode);
            builder.HasMany(e => e.Products).WithOne(e => e.CateringUnit).HasForeignKey(e => e.CateringUnitId);
            builder.HasMany(e => e.Orders).WithOne(e => e.CateringUnit).HasForeignKey(e => e.CateringUnitId);
            builder.HasMany(e => e.Tables).WithOne(e => e.CateringUnit).HasForeignKey(e => e.CateringUnitId);
            builder.HasMany(e => e.CateringUnitUsers).WithOne(e => e.CateringUnit).HasForeignKey(e => e.CateringUnitId);
            builder.HasMany(e => e.Categories).WithOne(e => e.CateringUnit).HasForeignKey(e => e.CateringUnitId);
            SetData(builder);
        }

        private static void SetData(EntityTypeBuilder<CateringUnit> builder)
        {
            builder.HasData(
                new CateringUnit
                {
                    Id = 1,
                    Name = "Best Catering Unit",
                    EntryCode = 123456,
                });
        }
    }
}
