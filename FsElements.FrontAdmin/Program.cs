using Blazored.LocalStorage;
using FsElements.FrontAdmin;
using FsElements.FrontAdmin.Extensions;
using FsElements.FrontAdmin.Services;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.DependencyInjection;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddBlazoredLocalStorage();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IElementCategoriesService, ElementCategoriesService>();

builder.Services.AddHttpClient(HttpClients.AuthApiClient, (sp, client) =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    client.BaseAddress = new Uri(config.GetValue<string>("Apis:AuthApiClient")!);
});

builder.Services.AddHttpClient(HttpClients.FormsApiClient, (sp, client) =>
{
    var config = sp.GetRequiredService<IConfiguration>();    
    client.BaseAddress = new Uri(config.GetValue<string>("Apis:FormsApiClient")!);
});
builder.Services.AddNotifyingCascadingValue(sp => sp.GetRequiredService<ICurrentUserService>());

await builder.Build().RunAsync();
