using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class IngredientEntityConfiguration : IEntityTypeConfiguration<Ingredient>
    {
        public void Configure(EntityTypeBuilder<Ingredient> builder)
        {
            builder.HasKey(i => i.Id);
            builder.Property(i => i.Name).IsRequired();
            builder.Property(i => i.Plusable).IsRequired();
            builder.Property(i => i.PlusPrice).IsRequired(false);
            builder.HasOne(i => i.Product).WithMany(p => p.Ingredients).HasForeignKey(i => i.ProductId);
            SetData(builder);
        }

        private void SetData(EntityTypeBuilder<Ingredient> builder)
        {
            builder.HasData(
                    new Ingredient { Id = 12, Name = "TomatoSauce", Plusable = false, ProductId = 2 },
                    new Ingredient { Id = 13, Name = "Cheese", Plusable = true, PlusPrice = 1.0f, ProductId = 2 },
                    new Ingredient { Id = 14, Name = "Salami", Plusable = true, PlusPrice = 2.0f, ProductId = 2 },
                    new Ingredient { Id = 1, Name = "TomatoSauce", Plusable = false, ProductId = 3 },
                    new Ingredient { Id = 2, Name = "Cheese", Plusable = true, PlusPrice = 1.0f, ProductId = 3 },
                    new Ingredient { Id = 3, Name = "Ham", Plusable = true, PlusPrice = 2.0f, ProductId = 3 },
                    new Ingredient { Id = 4, Name = "Grilled chicken", Plusable = false, ProductId = 4 },
                    new Ingredient { Id = 5, Name = "Mozzarella", Plusable = false, ProductId = 4 },
                    new Ingredient { Id = 6, Name = "Tomato", Plusable = false, ProductId = 4 },
                    new Ingredient { Id = 7, Name = "Potato", Plusable = false, ProductId = 4 },
                    new Ingredient { Id = 8, Name = "Hazelnut", ProductId = 5 },
                    new Ingredient { Id = 9, Name = "Brownie", ProductId = 5 },
                    new Ingredient { Id = 15, Name = "TomatoSauce", Plusable = false, ProductId = 1 },
                    new Ingredient { Id = 16, Name = "Cheese", Plusable = true, PlusPrice = 1.0f, ProductId = 1 }
            );
        }
    }
}
