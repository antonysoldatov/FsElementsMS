using AspNetCore.Identity.MongoDbCore.Models;

namespace FsElements.Auth.Data
{
    public class ApplicationRole : MongoIdentityRole
    {
        public ApplicationRole(string roleName) : base(roleName)
        {
        }
        public ApplicationRole() : base()
        {
        }
    }
}
