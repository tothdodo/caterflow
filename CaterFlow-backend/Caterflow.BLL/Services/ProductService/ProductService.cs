using Caterflow.BLL.DTOs.CategoryDTOs;
using Caterflow.BLL.DTOs.IngredientDTOs;
using Caterflow.BLL.DTOs.ProductDTOs;
using CaterFlow.DAL;
using CaterFlow.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Caterflow.BLL.Services.ProductService
{
    public class ProductService : IProductService
    {
        private readonly CaterFlowDbContext _dbContext;

        public ProductService(CaterFlowDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ProductDTO> CreateProduct(CreateProduct productData)
        {
            var dbUnit = await _dbContext.CateringUnits
                                        .Include(cu => cu.Categories)
                                        .FirstOrDefaultAsync(cu => cu.Id == productData.CateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {productData.CateringUnitId}.");

            var category = dbUnit.Categories.FirstOrDefault(c => c.Id == productData.CategoryId) ?? throw new ArgumentException($"Category not found with id: {productData.CategoryId}.");
            var newProduct = new Product
            {
                Name = productData.Name,
                Price = productData.Price,
                CategoryId = productData.CategoryId,
                CreationPlace = productData.CreationPlace
            };

            foreach (var ingredient in productData.Ingredients)
            {
                if ((ingredient.Plusable && ingredient.PlusPrice == 0) || (ingredient.Plusable && ingredient.PlusPrice == null))
                {
                    throw new ArgumentException($"Ingredient {ingredient.Name} is plusable but has no plus price.");
                }

                var dbIngredient = new Ingredient
                {
                    Name = ingredient.Name,
                    Plusable = ingredient.Plusable,
                    PlusPrice = ingredient.PlusPrice
                };

                newProduct.Ingredients.Add(dbIngredient);
            }

            dbUnit.Products.Add(newProduct);

            await _dbContext.SaveChangesAsync();

            var productDTO = new ProductDTO
            {
                Id = newProduct.Id,
                Name = newProduct.Name,
                Price = newProduct.Price,
                CategoryId = newProduct.CategoryId,
                Category = new CategoryDTO
                {
                    Id = category.Id,
                    Name = category.Name
                },
                Ingredients = newProduct.Ingredients.Select(i => new IngredientDTO
                {
                    Id = i.Id,
                    Name = i.Name,
                    Plusable = i.Plusable,
                    PlusPrice = i.PlusPrice
                }).ToList()
            };

            return productDTO;
        }

        public async Task<bool> DeleteProduct(GetProduct ids)
        {
            var dbUnit = await _dbContext.CateringUnits
                                        .Include(cu => cu.Products)
                                        .FirstOrDefaultAsync(cu => cu.Id == ids.CateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {ids.CateringUnitId}.");

            var product = dbUnit.Products.FirstOrDefault(p => p.Id == ids.ProductId);
            if (product == null)
            {
                return false;
            }

            dbUnit.Products.Remove(product);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<ProductDTO?> GetProductByIds(GetProduct ids)
        {
            var dbUnit = await _dbContext.CateringUnits
                                        .Include(cu => cu.Products)
                                            .ThenInclude(p => p.Category)
                                        .Include(cu => cu.Products)
                                            .ThenInclude(p => p.Ingredients)
                                        .FirstOrDefaultAsync(cu => cu.Id == ids.CateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {ids.CateringUnitId}.");

            var product = dbUnit.Products.FirstOrDefault(p => p.Id == ids.ProductId) ?? throw new ArgumentException($"Product not found with id: {ids.ProductId}.");

            var productDTO = new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                CreationPlace = product.CreationPlace,
                CategoryId = product.CategoryId,
                Category = new CategoryDTO
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name
                },
                Ingredients = product.Ingredients
                    .Select(i => new IngredientDTO
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Plusable = i.Plusable,
                        PlusPrice = i.PlusPrice
                    }).ToList()
            };
            return productDTO;
        }

        public async Task<ProductIngredients> GetProductIngredientsByIds(GetProduct ids)
        {
            var dbUnit = await _dbContext.CateringUnits
                                        .Include(cu => cu.Products)
                                            .ThenInclude(p => p.Ingredients)
                                        .FirstOrDefaultAsync(cu => cu.Id == ids.CateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {ids.CateringUnitId}.");

            var product = dbUnit.Products.FirstOrDefault(p => p.Id == ids.ProductId) ?? throw new ArgumentException($"Product not found with id: {ids.ProductId}.");

            var productDTO = new ProductIngredients
            {
                Id = product.Id,
                Name = product.Name,
                Ingredients = product.Ingredients
                    .Select(i => new IngredientPlusable
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Plusable = i.Plusable,
                    }).ToList(),
            };
            return productDTO;
        }

        public async Task<List<ProductsByCategory>> GetProductsByCateringUnitId(int cateringUnitId)
        {
            var dbUnit = await _dbContext.CateringUnits
                            .Include(cu => cu.Products)
                                .ThenInclude(p => p.Category)
                            .Include(cu => cu.Products)
                                .ThenInclude(p => p.Ingredients)
                            .FirstOrDefaultAsync(cu => cu.Id == cateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {cateringUnitId}.");

            var groupedProducts = dbUnit.Products
                .GroupBy(product => product.Category.Name)
                .Select(group => new ProductsByCategory
                {
                    CategoryName = group.Key,
                    Products = group.Select(product => new ProductHeader
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Price = product.Price
                    }).ToList()
                }).ToList();

            return groupedProducts;
        }

        public async Task<ProductDTO> UpdateProduct(CreateProduct product, int cateringUnitId, int productId)
        {
            var dbUnit = await _dbContext.CateringUnits
                                .Include(cu => cu.Products)
                                    .ThenInclude(p => p.Category)
                                .Include(cu => cu.Products)
                                    .ThenInclude(p => p.Ingredients)
                                .FirstOrDefaultAsync(cu => cu.Id == cateringUnitId) ?? throw new ArgumentException($"Catering unit not found with id: {cateringUnitId}.");

            var existingProduct = dbUnit.Products.FirstOrDefault(p => p.Id == productId) ?? throw new ArgumentException($"Product not found with id: {productId}.");
            var category = dbUnit.Categories.FirstOrDefault(c => c.Id == product.CategoryId) ?? throw new ArgumentException($"Category not found with id: {product.CategoryId}.");
            existingProduct.Name = product.Name;
            existingProduct.Price = product.Price;
            existingProduct.CategoryId = product.CategoryId;
            existingProduct.CreationPlace = product.CreationPlace;

            existingProduct.Ingredients.Clear();

            foreach (var ingredient in product.Ingredients)
            {
                if ((ingredient.Plusable && ingredient.PlusPrice == 0) || (ingredient.Plusable && ingredient.PlusPrice == null))
                {
                    throw new ArgumentException($"Ingredient {ingredient.Name} is plusable but has no plus price.");
                }

                var dbIngredient = new Ingredient
                {
                    Name = ingredient.Name,
                    Plusable = ingredient.Plusable,
                    PlusPrice = ingredient.PlusPrice
                };

                existingProduct.Ingredients.Add(dbIngredient);
            }

            await _dbContext.SaveChangesAsync();

            var productDTO = new ProductDTO
            {
                Id = existingProduct.Id,
                Name = existingProduct.Name,
                Price = existingProduct.Price,
                CategoryId = existingProduct.CategoryId,
                CreationPlace = existingProduct.CreationPlace,
                Category = new CategoryDTO
                {
                    Id = category.Id,
                    Name = category.Name
                },
                Ingredients = existingProduct.Ingredients.Select(i => new IngredientDTO
                {
                    Id = i.Id,
                    Name = i.Name,
                    Plusable = i.Plusable,
                    PlusPrice = i.PlusPrice
                }).ToList()
            };

            return productDTO;
        }
    }
}
