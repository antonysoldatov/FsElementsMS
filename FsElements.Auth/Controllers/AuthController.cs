using FsElements.Auth.Data;
using FsElements.Common;
using FsElements.Common.MassTransit;
using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using MongoDB.Driver.Linq;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Claims;

namespace FsElements.Auth.Controllers
{
    [ApiController]
    [Route("auth/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration configuration;
        private readonly IPublishEndpoint publishEndpoint;

        public AuthController(UserManager<ApplicationUser> userManager, 
                              IConfiguration configuration, 
                              IPublishEndpoint publishEndpoint)
        {
            this.userManager = userManager;
            this.configuration = configuration;
            this.publishEndpoint = publishEndpoint;
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginRequest request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized();
            if (!await userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized();

            string accessToken = await GenerateAccessToken(user);

            return Ok(new { accessToken });
        }

        private async Task<string> GenerateAccessToken(ApplicationUser user)
        {
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
            return accessToken;
        }

        [HttpPost]
        public async Task<ActionResult> RegisterSeller(RegisterRequest request)
        {
            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
                return BadRequest("User already exists.");

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                IsActiveSeller = true
            };

            await userManager.CreateAsync(user, request.Password);
            await userManager.AddToRoleAsync(user, Roles.Seller);

            await publishEndpoint.Publish(new SellerCreatedMessage(user.Id, user.Email));

            string accessToken = await GenerateAccessToken(user);

            return Ok(new { accessToken });
        }
    }

    public record LoginRequest(string Email, string Password);
    public record RegisterRequest(
        [EmailAddress]
        string Email,
        [MinLength(6)]
        string Password);
}
