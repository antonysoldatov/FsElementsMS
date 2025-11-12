using FsElements.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FsElements.OrdersApi.Entities
{
    public class Order : BaseEntity
    {
        [BsonGuidRepresentation(GuidRepresentation.Standard)]
        public Guid SellerId { get; set; }

        public List<OrderItem>? Items { get; set; }
        public string? BuyerPhone { get; set; }
        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class OrderItem
    {
        [BsonGuidRepresentation(GuidRepresentation.Standard)]
        public Guid ElementId { get; set; }
        public int Count { get; set; }
    }
}
