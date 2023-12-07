using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class CategoryEntityConfiguration: IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("Categories");
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Name).IsRequired();
            builder.HasOne(c => c.CateringUnit).WithMany(cu => cu.Categories).HasForeignKey(c => c.CateringUnitId);
            builder.HasData
            (
                new Category { Id = 1, Name = "Drinks", CateringUnitId = 1 },
                new Category { Id = 2, Name = "Appetizer", CateringUnitId = 1 },
                new Category { Id = 3, Name = "Pizza", CateringUnitId = 1 },
                new Category { Id = 4, Name = "Main dishes", CateringUnitId = 1 },
                new Category { Id = 5, Name = "Desserts", CateringUnitId = 1 }
            );
        }
    }
}
