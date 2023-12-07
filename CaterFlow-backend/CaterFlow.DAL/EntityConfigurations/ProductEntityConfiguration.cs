using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class ProductEntityConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Name).IsRequired();
            builder.Property(p => p.Price).IsRequired();
            builder.Property(p => p.CreationPlace).IsRequired();
            builder.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId);
            builder.HasMany(p => p.Ingredients).WithOne(i => i.Product).HasForeignKey(i => i.ProductId);
            builder.HasOne(p => p.CateringUnit).WithMany(cu => cu.Products).HasForeignKey(p => p.CateringUnitId).OnDelete(DeleteBehavior.Restrict);
            SetData(builder);
        }

        private static void SetData(EntityTypeBuilder<Product> builder)
        {
            builder.HasData(
                new Product
                {
                    Id = 1,
                    Price = 10.5f,
                    Name = "Pizza Margharita",
                    CategoryId = 3,
                    CateringUnitId = 1,
                    CreationPlace = ProductCreationPlace.Kitchen
                },

                new Product
                {
                    Id = 2,
                    Price = 10.5f,
                    Name = "Pizza Salami",
                    CategoryId = 3,
                    CateringUnitId = 1,
                    CreationPlace = ProductCreationPlace.Kitchen
                },

                new Product
                {
                    Id = 3,
                    Price = 11.5f,
                    Name = "Pizza Ham",
                    CategoryId = 3,
                    CateringUnitId = 1,
                    CreationPlace = ProductCreationPlace.Kitchen
                },

                new Product
                {
                    Id = 4,
                    Price = 14.5f,
                    Name = "Grilled chicken breast with mozzarella tomatoes and mashed potatoes",
                    CategoryId = 4,
                    CateringUnitId = 1,
                    CreationPlace = ProductCreationPlace.Kitchen
                },

                new Product
                {
                    Id = 5,
                    Price = 5.0f,
                    Name = "Hazelnut brownie",
                    CategoryId = 5,
                    CateringUnitId = 1,
                    CreationPlace = ProductCreationPlace.Kitchen
                },

                new Product { Id = 6, Price = 1.5f, Name = "Water", CreationPlace = ProductCreationPlace.Drink, CategoryId = 1, CateringUnitId = 1 },
                new Product { Id = 7, Price = 2.5f, Name = "Cola", CreationPlace = ProductCreationPlace.Drink, CategoryId = 1 , CateringUnitId = 1 },
                new Product { Id = 8, Price = 2.5f, Name = "Fanta", CreationPlace = ProductCreationPlace.Drink, CategoryId = 1 , CateringUnitId = 1 },
                new Product { Id = 9, Price = 2.5f, Name = "Sprite", CreationPlace = ProductCreationPlace.Drink, CategoryId = 1 , CateringUnitId = 1 },
                new Product { Id = 10, Price = 3.0f, Name = "Beer 0.3", CreationPlace = ProductCreationPlace.Drink, CategoryId = 1 , CateringUnitId = 1 },
                new Product { Id = 11, Price = 4.5f, Name = "Beer 0.5", CreationPlace = ProductCreationPlace.Drink, CategoryId = 1 , CateringUnitId = 1 }
            );
        }
    }
}



