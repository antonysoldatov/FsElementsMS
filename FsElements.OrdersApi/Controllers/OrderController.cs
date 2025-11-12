using FsElements.Common.Services;
using FsElements.OrdersApi.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FsElements.OrdersApi.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]  
    public class OrderController : Controller
    {
        private readonly IMongoRepository<Order> orderRepository;
        private readonly IMongoRepository<Element> elementRepository;
        private readonly IMongoRepository<Seller> sellerRepository;

        public OrderController(IMongoRepository<Order> orderRepository,
                               IMongoRepository<Element> elementRepository,
                               IMongoRepository<Seller> sellerRepository)
        {
            this.orderRepository = orderRepository;
            this.elementRepository = elementRepository;
            this.sellerRepository = sellerRepository;
        }

        [HttpPost]
        public async Task<IActionResult> MakeOrder([FromBody] MakeOrderDto dto)
        {
            if (dto.Elements == null || !dto.Elements.Any())
            {
                return BadRequest("Order must contain at least one element.");
            }

            var order = new Order
            {
                Id = Guid.NewGuid(),
                SellerId = Guid.Parse(dto.sellerId),
                BuyerPhone = dto.PhoneNumber,
                Address = dto.Address,
                Items = dto.Elements.Select(e => new OrderItem
                {
                    ElementId = Guid.Parse(e.ElementId),
                    Count = e.Count
                }).ToList(),
                CreatedAt = DateTime.UtcNow
            };

            await orderRepository.AddAsync(order);

            var seller = await sellerRepository.GetByIdAsync(order.SellerId);
            //note: send notification to seller.Email about new order

            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<OrderDto>>> GetBySellerId(string id)
        {
            var orders = await orderRepository.GetAsync(o => o.SellerId == Guid.Parse(id));
            var list = new List<OrderDto>();
            foreach (var order in orders)
            {
                var elementids = order.Items.Select(i => i.ElementId).ToList();
                var elements = await elementRepository.GetAsync(e => elementids.Contains(e.Id));
                list.Add(order.ToDto(elements));
            }
            return Ok(list);
        }
    }
}
