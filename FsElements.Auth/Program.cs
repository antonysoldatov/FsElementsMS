using FsElements.Auth.Data;
using FsElements.Auth.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using FsElements.Common.Extension;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IEmailSender<ApplicationUser>, DummyEmailSender>();

builder.Services.AddAuthenticationWithJwtBearer(builder.Configuration);
builder.Services.AddAuthorization();

builder.Services.AddMongoClientWithDatabase(builder.Configuration);
builder.Services.AddIdentityCore<ApplicationUser>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 6;
        options.Password.RequiredUniqueChars = 1;
    })
    .AddRoles<ApplicationRole>()
    .AddMongoDbStores<ApplicationUser, ApplicationRole, Guid>(
            connectionString: builder.Configuration.GetConnectionString("MongoConnection"),
            databaseName: "FsAuth")
    .AddUserManager<UserManager<ApplicationUser>>()
    .AddRoleManager<RoleManager<ApplicationRole>>()
    .AddDefaultTokenProviders();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddRabbitMqMassTransit();
builder.Services.AddCorsWithAllowClientPolicy("AllowSpecificClient");

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    FsDbSeed.Initialize(services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.MapIdentityApi<ApplicationUser>();
app.MapControllers();

app.UseCors("AllowSpecificClient");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();


app.Run();
