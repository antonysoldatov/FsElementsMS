using FsElements.OrdersApi.Entities;
using System.ComponentModel.DataAnnotations;

namespace FsElements.OrdersApi
{
    public record MakeOrderDto(
        List<ElementMakeOrderDto> Elements,
        [Required]
        string sellerId,
        [Required]
        string PhoneNumber,
        string Address);

    public record ElementMakeOrderDto([Required]string ElementId, int Count);

    public record OrderDto(
        string Id,
        string SellerId,
        List<ElementDto> Elements,
        string PhoneNumber,
        string Address,
        DateTime CreatedAt);

    public record ElementDto(string ElementId, int Count, string? UniqueCode, string? Name);

    public static class DtosExtensions
    {
        public static OrderDto ToDto(this Order order, List<Element> elements)
            => new OrderDto(
                order.Id.ToString(),
                order.SellerId.ToString(),
                order.Items!.Select(item => item.ToDto(elements.FirstOrDefault(x => x.Id == item.ElementId))).ToList(),
                order.BuyerPhone!,
                order.Address!,
                order.CreatedAt);

        public static ElementDto ToDto(this OrderItem item, Element? element)
            => new ElementDto(
                item.ElementId.ToString(),
                item.Count,
                element?.UniqueCode,
                element?.Name);
    }
}
