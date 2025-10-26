using System.ComponentModel.DataAnnotations;

namespace FsElements.FrontAdmin.Models
{
    public record LoginRequest(string Email, string Password);
    public record LoginResponse(string AccessToken);

    public record ElementCategoryDto(string Id, string Name);
    public record CreateElementCategoryDto([Required]string Name);
    public record DeleteElementCategoryDto(string Id);
    public record ElementFormDto(string Id, string Name, string Image, string ElementCategoryId);
    public record CreateElementFormDto(string Name, string ImageBase64, [Required]string ElementCategoryId);    
    public record DeleteElementFormDto(string Id);
}
