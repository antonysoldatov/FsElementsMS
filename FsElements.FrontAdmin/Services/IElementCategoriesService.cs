using FsElements.FrontAdmin.Models;
using Microsoft.AspNetCore.Components.Forms;

namespace FsElements.FrontAdmin.Services
{
    public interface IElementCategoriesService
    {        
        Task<ElementCategoryDto> AddCategory(string name);
        Task<ElementFormDto> AddForm(string name, string categoryId, IBrowserFile file);
        Task DeleteCategory(string id);
        Task DeleteForm(string id);
        Task<List<ElementCategoryDto>?> GetAllCategories();
        Task<ElementCategoryDto?> GetCategoryById(string id);
        Task<List<ElementFormDto>> GetFormsByCategoryId(string categoryId);
    }
}
