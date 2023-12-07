using Caterflow.BLL.DTOs.CategoryDTOs;
using Caterflow.BLL.DTOs.ProductDTOs;
using Caterflow.BLL.Services.ProductService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CaterFlow.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        public IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [Route("{cateringUnitId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<ProductsByCategory>>> GetProductsByCateringUnitId(int cateringUnitId)
        {
            try
            {
                var result = await _productService.GetProductsByCateringUnitId(cateringUnitId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDTO>> GetProductByIds([FromQuery] GetProduct ids)
        {
            try
            {
                var product = await _productService.GetProductByIds(ids);
                if (product == null)
                {
                    return NotFound();
                }
                return Ok(product);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ingredients")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductIngredients>> GetProductIngredientsByIds([FromQuery] GetProduct ids)
        {
            try
            {
                var product = await _productService.GetProductIngredientsByIds(ids);
                if (product == null)
                {
                    return NotFound();
                }
                return Ok(product);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<CategoryDTO>> CreateProduct([FromBody] CreateProduct product)
        {
            try
            {
                var result = await _productService.CreateProduct(product);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<CategoryDTO>> UpdateProduct([FromBody] CreateProduct product, [FromQuery] int productId, [FromQuery] int cateringUnitId)
        {
            try
            {
                var result = await _productService.UpdateProduct(product, cateringUnitId, productId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCategory([FromBody] GetProduct product)
        {
            try
            {
                var deleted = await _productService.DeleteProduct(product);
                if (deleted)
                {
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
