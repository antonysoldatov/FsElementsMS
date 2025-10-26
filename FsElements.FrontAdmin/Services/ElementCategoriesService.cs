using FsElements.FrontAdmin.Models;
using Microsoft.AspNetCore.Components.Forms;
using System.Net.Http.Json;

namespace FsElements.FrontAdmin.Services
{
    public class ElementCategoriesService : IElementCategoriesService, IDisposable
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly ILogger<ElementCategoriesService> logger;
        private readonly ICurrentUserService currentUser;
        private readonly HttpClient httpClient;

        public ElementCategoriesService(
            IHttpClientFactory httpClientFactory,
            ILogger<ElementCategoriesService> logger,
            ICurrentUserService currentUser)
        {
            this.httpClientFactory = httpClientFactory;
            this.logger = logger;
            this.currentUser = currentUser;

            httpClient = httpClientFactory.CreateClient(HttpClients.FormsApiClient);
            httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + currentUser.AuthToken);
        }

        public void Dispose()
        {
            httpClient.Dispose();
        }

        public async Task<ElementCategoryDto> AddCategory(string name)
        {
            try
            {
                var response = await httpClient.PostAsJsonAsync("Category/Create",
                    new CreateElementCategoryDto(name));
                if (response.IsSuccessStatusCode)
                {
                    var respJson = await response.Content.ReadFromJsonAsync<ElementCategoryDto>();
                    return respJson!;
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error add category");
            }
            return null;
        }

        public async Task DeleteCategory(string id)
        {
            try
            {
                await httpClient.DeleteAsync($"Category/Delete/{id}");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error delete category");
            }
        }

        public async Task<List<ElementCategoryDto>?> GetAllCategories()
        {
            try
            {
                return await httpClient.GetFromJsonAsync<List<ElementCategoryDto>?>("Category/GetAll");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error fetching categories");
                return null;
            }
        }

        public async Task<List<ElementFormDto>> GetFormsByCategoryId(string categoryId)
        {
            try
            {
                return await httpClient.GetFromJsonAsync<List<ElementFormDto>?>($"Form/GetByCategoryId/{categoryId}");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error fetching forms");
                return null;
            }
        }

        public async Task<ElementFormDto> AddForm(string name, string categoryId, IBrowserFile file)
        {
            try
            {
                string imageBase64 = null;
                if (file != null)
                {
                    using (var stream = file.OpenReadStream())
                    {
                        using var ms = new MemoryStream();
                        await stream.CopyToAsync(ms);
                        ms.Flush();
                        imageBase64 = Convert.ToBase64String(ms.ToArray());
                    }
                }
                var body = new CreateElementFormDto(name, imageBase64, categoryId);
                var response = await httpClient.PostAsJsonAsync("Form/Create", body);
                if (response.IsSuccessStatusCode)
                {
                    var respJson = await response.Content.ReadFromJsonAsync<ElementFormDto>();
                    return respJson!;
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error add form");
            }
            return null;
        }

        public async Task DeleteForm(string id)
        {
            try
            {
                await httpClient.DeleteAsync($"Form/Delete/{id}");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error delete form");
            }
        }

        public Task<ElementCategoryDto?> GetCategoryById(string id)
        {
            throw new NotImplementedException();
        }
    }
}
