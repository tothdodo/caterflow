using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class IngredientProductOrderEntityConfiguration : IEntityTypeConfiguration<IngredientProductOrder>
    {
        public void Configure(EntityTypeBuilder<IngredientProductOrder> builder)
        {
            builder.HasKey(ipo => ipo.Id);
            builder.Property(ipo => ipo.Name).IsRequired();
            builder.Property(ipo => ipo.ContainType).IsRequired();
            builder.Property(ipo => ipo.PlusPrice);
        }
    }
}
