using FsElements.Common.Services;
using FsElements.FormsApi.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:Issuer"];
        options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:Audience"];
        options.TokenValidationParameters.IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!));
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IMongoClient>(s => new MongoClient(builder.Configuration.GetValue<string>("MongoDbSettings:ConnectionString")));
builder.Services.AddSingleton<IMongoDatabase>(s =>
{
    var client = s.GetRequiredService<IMongoClient>();
    return client.GetDatabase(builder.Configuration.GetValue<string>("MongoDbSettings:DatabaseName")!);
});
builder.Services.AddTransient<IMongoRepository<ElementCategory>, MongoRepository<ElementCategory>>();
builder.Services.AddTransient<IMongoRepository<ElementForm>, MongoRepository<ElementForm>>();
builder.Services.AddScoped<IFileManageService, FileManageService>();


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

app.UseAuthentication();
app.UseAuthorization();

app.Run();
