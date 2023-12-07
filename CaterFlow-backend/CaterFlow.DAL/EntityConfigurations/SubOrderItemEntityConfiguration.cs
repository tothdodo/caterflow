using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class SubOrderItemEntityConfiguration : IEntityTypeConfiguration<SubOrderItem>
    {
        public void Configure(EntityTypeBuilder<SubOrderItem> builder)
        {
            builder.HasKey(po => po.Id);
            builder.Property(po => po.Price).IsRequired();
            builder.Property(po => po.Amount).IsRequired();
            builder.Property(po => po.AmountToPay).IsRequired();
            builder.HasOne(po => po.Product).WithMany();
            builder.HasOne(po => po.SubOrder).WithMany(po => po.SubOrderItems);
        }
    }
}
