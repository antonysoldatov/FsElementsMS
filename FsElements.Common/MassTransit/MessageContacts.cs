using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FsElements.Common.MassTransit
{
    public record SellerCreatedMessage(Guid SellerId, string Email);

    public record ElementAddOrEditMessage(Guid ElementId, string UniqueCode, string Name);
}
