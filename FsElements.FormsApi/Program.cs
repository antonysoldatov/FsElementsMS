using FsElements.Common.Extension;
using FsElements.Common.Services;
using FsElements.FormsApi.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AzureBlobSettings>(builder.Configuration.GetSection("AzureBlobSettings"));

// Add services to the container.
builder.Services.AddAuthenticationWithJwtBearer(builder.Configuration);
builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMongoClientWithDatabase(builder.Configuration);
builder.Services.AddTransient<IMongoRepository<ElementCategory>, MongoRepository<ElementCategory>>();
builder.Services.AddTransient<IMongoRepository<ElementForm>, MongoRepository<ElementForm>>();
builder.Services.AddScoped<IFileManageService, AzureBlobFileManagerService>();
builder.Services.AddCorsWithAllowClientPolicy("AllowSpecificClient");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});

app.MapControllers();

app.UseCors("AllowSpecificClient");

app.UseAuthentication();
app.UseAuthorization();

app.Run();
