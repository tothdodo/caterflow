using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class OrderEntityConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(ipo => ipo.Id);
            builder.Property(ipo => ipo.Date).IsRequired();
            builder.Property(ipo => ipo.Status).IsRequired();
            builder.HasMany(ipo => ipo.SubOrders).WithOne(op => op.Order).HasForeignKey(op => op.OrderId);
            builder.HasOne(ipo => ipo.Table).WithMany().HasForeignKey(ipo => ipo.TableId);
            builder.HasOne(ipo => ipo.CateringUnit).WithMany(cu => cu.Orders).HasForeignKey(ipo => ipo.CateringUnitId);
        }
    }
}
