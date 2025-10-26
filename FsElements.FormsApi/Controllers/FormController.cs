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
    public class FormController : ControllerBase
    {
        private readonly IMongoRepository<ElementForm> formsRepository;
        private readonly IFileManageService fileManageService;

        public FormController(IMongoRepository<ElementForm> formsRepository, IFileManageService fileManageService)
        {
            this.formsRepository = formsRepository;
            this.fileManageService = fileManageService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<ElementFormDto>>> GetAll()
        {
            var list = await formsRepository.GetAllAsync();
            var dtos = list.Select(f => f.ToDto()).ToList();
            return Ok(dtos);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("{categoryId}")]
        public async Task<ActionResult<List<ElementFormDto>>> GetByCategoryId(string categoryId)
        {
            var categoryIdGuid = new Guid(categoryId);
            var list = await formsRepository.GetAsync(f => f.ElementCategoryId == categoryIdGuid);
            var dtos = list.Select(f => f.ToDto()).ToList();
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<ElementFormDto>> Create([FromBody] CreateElementFormDto dto)
        {
            var fileName = await fileManageService.SaveFile(dto.ImageBase64, FileFolders.Forms);

            var form = new ElementForm
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Image = fileName,
                ElementCategoryId = new Guid(dto.ElementCategoryId)
            };
            await formsRepository.AddAsync(form);
            return Ok(form.ToDto());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var form = await formsRepository.GetByIdAsync(new Guid(id));
            if (form == null)
            {
                return NotFound();
            }
            await formsRepository.DeleteAsync(form.Id);
            return Ok();
        }
    }
}
