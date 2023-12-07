using Caterflow.BLL.DTOs.CategoryDTOs;
using Caterflow.BLL.DTOs.ProductDTOs;

namespace Caterflow.BLL.Services.ProductService
{
    public interface IProductService
    {
        Task<ProductDTO> CreateProduct(CreateProduct category);
        Task<bool> DeleteProduct(GetProduct category);
        Task<List<ProductsByCategory>> GetProductsByCateringUnitId(int cateringUnitId);
        Task<ProductDTO?> GetProductByIds(GetProduct ids);
        Task<ProductDTO> UpdateProduct(CreateProduct category, int cateringUnitId, int productId);
        Task<ProductIngredients> GetProductIngredientsByIds(GetProduct ids);
    }
}
