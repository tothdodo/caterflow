using Caterflow.BLL.DTOs.CategoryDTOs;
using CaterFlow.DAL;
using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Caterflow.BLL.Services.CategoryService
{
    public class CategoryService : ICategoryService
    {
        private readonly CaterFlowDbContext _dbContext;

        public CategoryService(CaterFlowDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CategoryDTO> CreateCategory(CreateCategory category)
        {
            var dbUnit = await _dbContext.CateringUnits.Include(cu => cu.Categories).FirstOrDefaultAsync(cu => cu.Id == category.CateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {category.CateringUnitId}.");
            
            var existingCategory = dbUnit.Categories.FirstOrDefault(c => c.Name == category.Name);
            if (existingCategory != null)
            {
                throw new InvalidOperationException($"Category {category.Name} already exists.");
            }

            var newCategory = new Category
            {
                Name = category.Name
            };

            dbUnit.Categories.Add(newCategory);

            await _dbContext.SaveChangesAsync();

            var categoryDTO = new CategoryDTO
            {
                Id = newCategory.Id,
                Name = newCategory.Name
            };
            return categoryDTO;
        }

        public async Task<List<CategoryDTO>> GetCategoriesByCateringUnitId(int cateringUnitId)
        {
            var dbUnit = await _dbContext.CateringUnits.Include(cu => cu.Categories).FirstOrDefaultAsync(cu => cu.Id == cateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {cateringUnitId}.");
            
            var categoryDTOs = dbUnit.Categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();

            return categoryDTOs;
        }

        public async Task<CategoryDTO?> GetCategoryByIds(GetCategory ids)
        {
            var dbUnit = await _dbContext.CateringUnits.Include(cu => cu.Categories).FirstOrDefaultAsync(cu => cu.Id == ids.CateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {ids.CateringUnitId}.");
            
            var category = dbUnit.Categories.FirstOrDefault(c => c.Id == ids.CategoryId);
            if (category == null)
            {
                return null;
            }

            var categoryDTO = new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name
            };
            return categoryDTO;
        }

        public async Task<CategoryDTO> UpdateCategory(CategoryDTO category, int cateringUnitId)
        {
            var dbUnit = await _dbContext.CateringUnits.Include(cu => cu.Categories).FirstOrDefaultAsync(cu => cu.Id == cateringUnitId) ?? throw new ArgumentException($"Catering unit not exist with id: {cateringUnitId}.");
            
            var existingCategoryName = dbUnit.Categories.FirstOrDefault(c => c.Name == category.Name);
            if (existingCategoryName != null)
            {
                throw new InvalidOperationException($"Category {category.Name} already exists.");
            }

            var existingCategory = dbUnit.Categories.FirstOrDefault(c => c.Id == category.Id) ?? throw new ArgumentException($"Category not exist with id: {category.Id}.");
            existingCategory.Name = category.Name;

            await _dbContext.SaveChangesAsync();

            var categoryDTO = new CategoryDTO
            {
                Id = existingCategory.Id,
                Name = existingCategory.Name
            };
            return categoryDTO;
        }
        
        public async Task<bool> DeleteCategory(GetCategory ids)
        {
            var dbUnit = await _dbContext.CateringUnits.Include(cu => cu.Categories).Include(c => c.Products)
                .SingleOrDefaultAsync(unit => unit.Id == ids.CateringUnitId) ?? throw new Exception($"Catering unit not found with id: {ids.CateringUnitId}.");
            if(dbUnit.Products.Any(product => product.CategoryId == ids.CategoryId))
            {
                throw new Exception("Cannot delete a category which has attached protucts!");
            }
            var dbCategory = dbUnit.Categories.SingleOrDefault(category => category.Id == ids.CategoryId);
            if (dbCategory == null)
            {
                return false;
            }

            dbUnit.Categories.Remove(dbCategory);

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
