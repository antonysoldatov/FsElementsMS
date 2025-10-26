using FsElements.Common;
using Microsoft.AspNetCore.Identity;
using System.Data;

namespace FsElements.Auth.Data
{
    public class FsDbSeed
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            SeedRoles(serviceProvider).Wait();
            SeedUsers(serviceProvider).Wait();
        }

        private static async Task SeedRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var role = await roleManager.FindByNameAsync(Roles.Admin);
            if (role == null)
            {
                await roleManager.CreateAsync(new ApplicationRole(Roles.Admin));
            }

            var roleSeller = await roleManager.FindByNameAsync(Roles.Seller);
            if (roleSeller == null)
            {
                await roleManager.CreateAsync(new ApplicationRole(Roles.Seller));
            }
        }

        private static async Task SeedUsers(IServiceProvider serviceProvider)
        {
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var adminUser = configuration["AdminUser"];
            var adminPswd = configuration["AdminPassword"];

            var u = await userManager.FindByNameAsync(adminUser!);
            if (u == null)
            {
                var admin = new ApplicationUser()
                {
                    UserName = adminUser,
                    Email = adminUser,
                    EmailConfirmed = true
                };
                await userManager.CreateAsync(admin, adminPswd!);
                await userManager.AddToRoleAsync(admin, Roles.Admin);
            }
        }
    }
}
