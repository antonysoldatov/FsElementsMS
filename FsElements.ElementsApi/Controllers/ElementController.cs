using FsElements.Common;
using FsElements.Common.MassTransit;
using FsElements.Common.Services;
using FsElements.ElementsApi.Entities;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace FsElements.ElementsApi.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]    
    public class ElementController : Controller
    {
        private readonly IMongoRepository<Element> elementsRepository;
        private readonly IPublishEndpoint publishEndpoint;

        public ElementController(IMongoRepository<Element> elementsRepository, IPublishEndpoint publishEndpoint)
        {
            this.elementsRepository = elementsRepository;
            this.publishEndpoint = publishEndpoint;
        }

        [HttpGet]
        public async Task<ActionResult<List<ElementDto>>> GetBySeller(string sellerId)
        {
            var sellerIdGuid = Guid.Parse(sellerId);
            var elements = await elementsRepository.GetAsync(x => x.SellerId == sellerIdGuid);
            var list = elements.Select(x => x.ToDto()).ToList();
            return Ok(list);
        }

        [HttpGet]
        public async Task<ActionResult<ElementDto>> GetById(string id)
        {
            var element = await elementsRepository.GetByIdAsync(Guid.Parse(id));
            if (element == null)
            {
                return NotFound();
            }
            return Ok(element.ToDto());
        }

        [HttpPost]
        [Authorize(Roles = Roles.Seller)]
        public async Task<ActionResult> AddOrEdit([FromBody] CreateOrUpdateElementDto data)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            var element = new Element
            {
                Id = string.IsNullOrEmpty(data.Id) ? Guid.NewGuid() : Guid.Parse(data.Id),
                UniqueCode = data.UniqueCode,
                Name = data.Name,
                PriceWholesale = data.PriceWholesale,
                PriceRetail = data.PriceRetail,
                Width = data.Width,
                Height = data.Height,
                Weight = data.Weight,
                ElementFormId = Guid.Parse(data.ElementFormId),
                CategoryId = Guid.Parse(data.CategoryId),
                SellerId = Guid.Parse(userId)
            };

            if (string.IsNullOrEmpty(data.Id))
            {
                await elementsRepository.AddAsync(element);
            }
            else
            {
                var existingEntry = await elementsRepository.GetByIdAsync(element.Id);
                if (existingEntry == null || existingEntry.SellerId != element.SellerId)
                {
                    return BadRequest("Seller can not change element");
                }
                await elementsRepository.UpdateAsync(element.Id, element);
            }

            await publishEndpoint.Publish(new ElementAddOrEditMessage(element.Id, element.UniqueCode, element.Name));

            return Ok();
        }
                
        [Authorize(Roles = Roles.Seller)]
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var element = await elementsRepository.GetByIdAsync(Guid.Parse(id));
            if (element == null || element.SellerId.ToString() != userId)
            {
                return BadRequest("Seller can not delete element");
            }
            await elementsRepository.DeleteAsync(Guid.Parse(id));
            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<List<ElementDto>>> GetWithFilter([FromQuery] string? categoryId, [FromQuery] string? formId)
        {
            var elements = await elementsRepository.GetAsync(x =>
                (string.IsNullOrEmpty(categoryId) ? true : x.CategoryId == Guid.Parse(categoryId)) &&
                (string.IsNullOrEmpty(formId) ? true : x.ElementFormId == Guid.Parse(formId))
            );
            var list = elements.Select(x => x.ToDto()).ToList();
            return Ok(list);
        }
    }
}
