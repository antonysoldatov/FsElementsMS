using FsElements.Auth.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using MongoDB.Driver.Linq;
using System.Security.Claims;

namespace FsElements.Auth.Controllers
{
    [ApiController]
    [Route("auth/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration configuration;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.configuration = configuration;
        }

        [HttpPost]
        public async Task<ActionResult<string>> Login(LoginRequest request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized();
            if (!await userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized();

            var roles = await userManager.GetRolesAsync(user);

            var signingKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
            var signingCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(signingKey, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>() 
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!)
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var tokenDescriptor = new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(configuration.GetValue<int>("Jwt:ExpiresInHours")),
                Audience = configuration["Jwt:Audience"],
                Issuer = configuration["Jwt:Issuer"],
                SigningCredentials = signingCredentials
            };

            var accessToken = new JsonWebTokenHandler().CreateToken(tokenDescriptor);

            return Ok(new { accessToken });
        }
    }

    public record LoginRequest(string Email, string Password);
}
