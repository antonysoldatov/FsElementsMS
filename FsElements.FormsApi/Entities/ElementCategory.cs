using FsElements.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace FsElements.FormsApi.Entities
{
    public class ElementCategory : BaseEntity
    {
        public string Name { get; set; }
    }
}
