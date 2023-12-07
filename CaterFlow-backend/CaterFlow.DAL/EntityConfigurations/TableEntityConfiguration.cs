using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class TableEntityConfiguration : IEntityTypeConfiguration<Table>
    {
        public void Configure(EntityTypeBuilder<Table> builder)
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Number).IsRequired();
            builder.HasOne(t => t.CateringUnit).WithMany(cu => cu.Tables).HasForeignKey(t => t.CateringUnitId).IsRequired();

            SetData(builder);
        }

        private static void SetData(EntityTypeBuilder<Table> builder)
        {
            for (int i = 1; i <= 10; i++)
            {
                builder.HasData(
                    new Table
                    {
                        Id = i,
                        Number = i,
                        CateringUnitId = 1
                    });
            }
        }
    }
}
