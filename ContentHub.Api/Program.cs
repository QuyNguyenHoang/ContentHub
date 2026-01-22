using ContentHub.Api;
using ContentHub.Api.Services;
using ContentHub.Application.ConfigOptions;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks;
using ContentHub.Infrastructure;
using ContentHub.Infrastructure.SeedWorks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// =======================
// Database + Identity
// =======================
builder.Services.AddDbContext<ContentHubDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, AppRole>()
    .AddEntityFrameworkStores<ContentHubDbContext>()
    .AddDefaultTokenProviders();

// =======================
// JWT CONFIG
// =======================
builder.Services.Configure<JwtTokenSettings>(
    configuration.GetSection("JwtTokenSettings"));

var jwtSettings = configuration
    .GetSection("JwtTokenSettings")
    .Get<JwtTokenSettings>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings!.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key)),

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// =======================
// CORS
// =======================
var allowedOrigins = configuration["AllowedOrigins"]
    ?.Split(";", StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("TeduCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins ?? Array.Empty<string>())
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// =======================
// Services
// =======================
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped(typeof(IRepository<,>), typeof(RepositoryBase<,>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// =======================
// Middleware
// =======================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("TeduCorsPolicy");
app.UseHttpsRedirection();

app.UseAuthentication(); // ⚠️ BẮT BUỘC
app.UseAuthorization();

app.MapControllers();
app.MigrateDatabase();
app.Run();
