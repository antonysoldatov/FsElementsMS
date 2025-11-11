using FsElements.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FsElements.ElementsApi.Entities
{
    public class Element : BaseEntity
    {
        [Required]
        public string? UniqueCode { get; set; }

        [Required,StringLength(250)]
        public string? Name { get; set; } 

        [Required]
        public decimal PriceWholesale { get; set; }

        [Required]
        public decimal PriceRetail { get; set; }
                
        public double Width { get; set; }

        public double Height { get; set; }

        public double Weight { get; set; }
                
        [BsonGuidRepresentation(GuidRepresentation.Standard)]
        public Guid ElementFormId { get; set; }
                
        [BsonGuidRepresentation(GuidRepresentation.Standard)]
        public Guid CategoryId { get; set; }
        
        [BsonGuidRepresentation(GuidRepresentation.Standard)]
        public Guid SellerId { get; set; }
    }
}
