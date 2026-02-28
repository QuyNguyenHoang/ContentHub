using ContentHub.Api;
using ContentHub.Api.Authorization;
using ContentHub.Api.Services;
using ContentHub.Application.ConfigOptions;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks;
using ContentHub.Infrastructure;
using ContentHub.Infrastructure.SeedWorks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
Console.WriteLine("ENV: " + builder.Environment.EnvironmentName);
Console.WriteLine("CONNECTION: " + configuration.GetConnectionString("DefaultConnection"));
// =======================
// Database + Identity
// =======================
builder.Services.AddDbContext<ContentHubDbContext>(options =>
{
    var connectionString = configuration.GetConnectionString("DefaultConnection");

    if (builder.Environment.IsDevelopment())
    {
        options.UseSqlServer(connectionString);
    }
    else
    {
        options.UseNpgsql(connectionString);
    }
});

builder.Services.AddIdentity<AppUser, AppRole>()
    .AddEntityFrameworkStores<ContentHubDbContext>()
    .AddDefaultTokenProviders();

// =======================
// JWT
// =======================
builder.Services.Configure<JwtTokenSettings>(
    configuration.GetSection("JwtTokenSettings"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        ValidIssuer = configuration["JwtTokenSettings:Issuer"],
        ValidAudience = configuration["JwtTokenSettings:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration["JwtTokenSettings:Key"]!)
        )
    };
});

// =======================
// AUTHORIZATION (CUSTOM PERMISSION)
// =======================
builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
builder.Services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

// =======================
// CORS
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("ContentHubPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// =======================
// Services
// =======================
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ContentHub.Api.Services.IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped(typeof(IRepository<,>), typeof(RepositoryBase<,>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");




//Auto mapper
builder.Services.AddAutoMapper(typeof(PostInListDto));
var app = builder.Build();

// =======================
// Middleware
// =======================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ContentHubPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MigrateDatabase();
app.Run();
