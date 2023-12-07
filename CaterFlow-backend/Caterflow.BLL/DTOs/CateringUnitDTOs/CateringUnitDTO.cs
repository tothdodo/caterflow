using Caterflow.BLL.DTOs.CategoryDTOs;
using CaterFlow.DAL.Entities;

namespace Caterflow.BLL.DTOs.CateringUnitDTOs
{
    public class CateringUnitDTO
    {
        public CateringUnitDTO()
        {
            CateringUnitUsers = new HashSet<CateringUnitUserDTO>();
            Tables = new HashSet<Table>();
            Products = new HashSet<Product>();
            Categories = new HashSet<CategoryDTO>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Table> Tables { get; set; }

        public virtual ICollection<CateringUnitUserDTO> CateringUnitUsers { get; set; }

        public virtual ICollection<Product> Products { get; set; }

        public virtual ICollection<CategoryDTO> Categories { get; set; }
    }
}
