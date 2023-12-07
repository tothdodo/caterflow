using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace CaterFlow.DAL.EntityConfigurations
{
    public class CateringUnitUserEntityConfiguration : IEntityTypeConfiguration<CateringUnitUser>
    {
        public void Configure(EntityTypeBuilder<CateringUnitUser> builder)
        {
            builder.HasKey(cuu => new { cuu.CateringUnitId, cuu.UserId });
            builder.HasOne(cuu => cuu.CateringUnit).WithMany(cu => cu.CateringUnitUsers).HasForeignKey(cuu => cuu.CateringUnitId);
            builder.HasOne(cuu => cuu.User).WithMany(u => u.CateringUnitUsers).HasForeignKey(cuu => cuu.UserId);
        }
    }
}
