using FsElements.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FsElements.FormsApi.Entities
{
    public class ElementForm : BaseEntity
    {
        public string? Name { get; set; }

        public string? Image { get; set; }

        [BsonGuidRepresentation(GuidRepresentation.Standard)]
        public Guid ElementCategoryId { get; set; }
    }
}
