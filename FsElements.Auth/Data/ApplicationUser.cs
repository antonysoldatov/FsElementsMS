using AspNetCore.Identity.MongoDbCore.Models;

namespace FsElements.Auth.Data
{
    public class ApplicationUser: MongoIdentityUser
    {
        public bool IsActiveSeller { get; set; }
    }
}
