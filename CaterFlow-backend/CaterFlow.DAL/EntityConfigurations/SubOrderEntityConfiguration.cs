using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class SubOrderEntityConfiguration : IEntityTypeConfiguration<SubOrder>
    {
        public void Configure(EntityTypeBuilder<SubOrder> builder)
        {
            builder.HasKey(po => po.Id);
            builder.Property(po => po.WaiterName).IsRequired();
            builder.Property(po => po.KitchenStatus).IsRequired();
            builder.Property(po => po.DrinkStatus).IsRequired();
            builder.Property(po => po.Date).IsRequired();
            builder.Property(po => po.DiningOption).IsRequired();
            builder.HasMany(po => po.SubOrderItems).WithOne(soi => soi.SubOrder).HasForeignKey(ipo => ipo.SubOrderId);
            builder.HasOne(po => po.Order).WithMany(o => o.SubOrders);
        }
    }
}
