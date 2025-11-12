using FsElements.Common.Extension;
using FsElements.Common.Services;
using FsElements.OrdersApi.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAuthenticationWithJwtBearer(builder.Configuration);
builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMongoClientWithDatabase(builder.Configuration);
builder.Services.AddCorsWithAllowClientPolicy("AllowSpecificClient");
builder.Services.AddRabbitMqMassTransit();
builder.Services.AddTransient<IMongoRepository<Seller>, MongoRepository<Seller>>();
builder.Services.AddTransient<IMongoRepository<Element>, MongoRepository<Element>>();
builder.Services.AddTransient<IMongoRepository<Order>, MongoRepository<Order>>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificClient");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
