using ContentHub.Api;
using ContentHub.Api.Authorization;
using ContentHub.Api.Services;
using ContentHub.Application.ConfigOptions;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks;
using ContentHub.Infrastructure;
using ContentHub.Infrastructure.Repositories;
using ContentHub.Infrastructure.SeedWorks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
using CloudinaryDotNet;
using System.Text.Json.Serialization;
using ContentHub.Infrastructure.Repositories.System;
using ContentHub.Application.IRepositories.System;
using ContentHub.Application.IRepositories.Auth;
using ContentHub.Infrastructure.Services;
using ContentHub.Infrastructure.Repositories.Auth;


Env.Load();


var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// =======================
// Database + Identity
// =======================
builder.Services.AddDbContext<ContentHubDbContext>(options =>
{
    var dbUser = "postgres.jhpegibbuqpvapxrrkof";
    var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
    var dbServer = "aws-1-ap-southeast-1.pooler.supabase.com";
    var dbPort = "5432";
    var dbName = "postgres";
    var connectionString = $"User Id={dbUser};Password={dbPassword};Server={dbServer};Port={dbPort};Database={dbName}";
    options.UseNpgsql(connectionString);
});

builder.Services.AddIdentity<AppUser, AppRole>()
    .AddEntityFrameworkStores<ContentHubDbContext>()
    .AddDefaultTokenProviders();



//Lock account after 5 failed login attemps
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
});



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
        policy.WithOrigins("http://localhost:5173", "https://content-hub-weld.vercel.app") 
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// =======================
// Services
// =======================
builder.Services.AddScoped<IAuthRepository,AuthRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ContentHub.Application.IService.ITokenService, ContentHub.Infrastructure.Services.TokenService>();
builder.Services.AddScoped(typeof(IRepository<,>), typeof(RepositoryBase<,>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<ISeriesRepository, SeriesRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<ICommentRepository,CommentRepository>();
builder.Services.AddScoped<IReactionRepository, ReactionRepository>();
builder.Services.AddScoped<IPostActivityLogRepository, PostActivityLogRepository>();
builder.Services.AddScoped<IAnalyticRepository, AnalyticRepository>();
builder.Services.AddScoped<ContentHub.Application.IService.IEmailService, ContentHub.Infrastructure.Service.SmtpEmailSender>();
builder.Services.AddScoped<DateRangeResolver>();
builder.Services.AddControllers().AddJsonOptions(option =>
{
    option.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



//var port = Environment.GetEnvironmentVariable("PORT") ?? "7202";
//builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

//SingIR
builder.Services.AddSignalR();


//Auto mapper
builder.Services.AddAutoMapper(typeof(PostInListDto).Assembly);

//CLoudinary
builder.Services.AddSingleton(provider =>
{
    var cloudName = Environment.GetEnvironmentVariable("KEY_NAME");
    var apiKey = Environment.GetEnvironmentVariable("API_KEY");
    var apiSecret = Environment.GetEnvironmentVariable("API_SECRET");

    if (string.IsNullOrEmpty(cloudName) ||
        string.IsNullOrEmpty(apiKey) ||
        string.IsNullOrEmpty(apiSecret))
    {
        throw new Exception("Cloudinary config missing!");
    }

    var account = new Account(cloudName, apiKey, apiSecret);

    return new Cloudinary(account);
});
var app = builder.Build();

// =======================
// Middleware
// =======================







app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("ContentHubPolicy");
Console.WriteLine("WebRootPath: " + app.Environment.WebRootPath);
//if (app.Environment.IsDevelopment())
//{

//}
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
//Map SignalR
app.MapHub<CommentHub>("/hubs/comments");
try
{
    app.MigrateDatabase();
}
catch (Exception ex)
{
    Console.WriteLine("Migration failed: " + ex.Message);
}


//Middleware
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var error = context.Features.Get<IExceptionHandlerFeature>()?.Error;

        context.Response.StatusCode = StatusCodes.Status400BadRequest;

        await context.Response.WriteAsJsonAsync(new
        {
            message = error?.Message
        });
    });
});


app.Run();
