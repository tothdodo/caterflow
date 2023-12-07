using Caterflow.BLL.DTOs.CategoryDTOs;
using Caterflow.BLL.Services.CategoryService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CaterFlow.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        public ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        [Route("{cateringUnitId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<CategoryDTO>>> GetCategoriesByCateringUnitId(int cateringUnitId)
        {
            try
            {
                var result = await _categoryService.GetCategoriesByCateringUnitId(cateringUnitId);
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
        public async Task<ActionResult<CategoryDTO>> GetCategoryByIds([FromQuery] GetCategory ids)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIds(ids);
                if (category == null)
                {
                    return NotFound();
                }
                return Ok(category);
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
        public async Task<ActionResult<CategoryDTO>> CreateCategory([FromBody] CreateCategory category)
        {
            try
            {
                var result = await _categoryService.CreateCategory(category);
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
        [Route("{cateringUnitId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<CategoryDTO>> UpdateCategory([FromBody] CategoryDTO category, [FromRoute] int cateringUnitId)
        {
            try
            {
                var result = await _categoryService.UpdateCategory(category, cateringUnitId);
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
        public async Task<ActionResult> DeleteCategory([FromBody] GetCategory category)
        {
            try
            {
                var deleted = await _categoryService.DeleteCategory(category);
                if (deleted)
                {
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
