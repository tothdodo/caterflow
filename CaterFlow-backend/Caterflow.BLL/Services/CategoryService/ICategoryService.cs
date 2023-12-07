using Caterflow.BLL.DTOs.CategoryDTOs;

namespace Caterflow.BLL.Services.CategoryService
{
    public interface ICategoryService
    {
        Task<CategoryDTO> CreateCategory(CreateCategory category);
        Task<bool> DeleteCategory(GetCategory category);
        Task<List<CategoryDTO>> GetCategoriesByCateringUnitId(int cateringUnitId);
        Task<CategoryDTO?> GetCategoryByIds(GetCategory ids);
        Task<CategoryDTO> UpdateCategory(CategoryDTO category, int cateringUnitId);
    }
}
