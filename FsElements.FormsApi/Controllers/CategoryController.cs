using FsElements.Common;
using FsElements.Common.Services;
using FsElements.FormsApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FsElements.FormsApi.Controllers
{    
    [ApiController]
    [Route("[controller]/[action]")]
    [Authorize(Roles = Roles.Admin)]
    public class CategoryController : ControllerBase
    {
        private readonly IMongoRepository<ElementCategory> categoryRepository;

        public CategoryController(IMongoRepository<ElementCategory> categoryRepository)
        {
            this.categoryRepository = categoryRepository;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<ElementCategoryDto>>> GetAll()
        {
            var list = await categoryRepository.GetAllAsync();
            var dtos = list.Select(c => c.ToDto()).ToList();
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<ElementCategoryDto>> Create([FromBody] CreateElementCategoryDto dto)
        {
            var category = new ElementCategory
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };
            await categoryRepository.AddAsync(category);
            return Ok(category.ToDto());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var category = await categoryRepository.GetByIdAsync(new Guid(id));
            if (category == null)
            {
                return NotFound();
            }
            await categoryRepository.DeleteAsync(category.Id);
            return Ok();
        }
    }
}
