using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class ProductOrderEntityConfiguration : IEntityTypeConfiguration<ProductOrder>
    {
        public void Configure(EntityTypeBuilder<ProductOrder> builder)
        {
            builder.HasKey(po => po.Id);
            builder.Property(po => po.Name).IsRequired();
            builder.Property(po => po.Price).IsRequired();
            builder.Property(po => po.CreationPlace).IsRequired();
            builder.HasMany(po => po.Ingredients).WithOne().HasForeignKey(ipo => ipo.ProductOrderId);
        }
    }
}
