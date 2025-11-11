using System.ComponentModel.DataAnnotations;

namespace FsElements.ElementsApi
{
    public record ElementDto(
         string Id,
         string UniqueCode,
         string Name,
         decimal PriceWholesale,
         decimal PriceRetail,
         double Width,
         double Height,
         double Weight,
         string ElementFormId,
         string CategoryId,
         string SellerId
     );
    public record CreateOrUpdateElementDto(
        string? Id,
        [Required]
        string UniqueCode,
        [Required]
        string Name,
        [Required]
        decimal PriceWholesale,
        [Required]
        decimal PriceRetail,
        double Width,
        double Height,
        double Weight,
        [Required]
        string ElementFormId,
        [Required]
        string CategoryId
    );
}
