using FsElements.Common;

namespace FsElements.OrdersApi.Entities
{
    public class Element : BaseEntity
    {
        public string UniqueCode { get; set; }
        public string Name { get; set; }
    }
}
