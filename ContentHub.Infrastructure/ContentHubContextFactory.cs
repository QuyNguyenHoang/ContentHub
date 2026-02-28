using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace ContentHub.Infrastructure
{
    public class ContentHubContextFactory
        : IDesignTimeDbContextFactory<ContentHubDbContext>
    {
        public ContentHubDbContext CreateDbContext(string[] args)
        {
            // Lấy môi trường hiện tại
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
                              ?? "Development";

            // Load config theo môi trường
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<ContentHubDbContext>();

            // Kiểm tra môi trường
            if (environment == "Production")
            {
                builder.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"));
            }
            else
            {
                builder.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"));
            }

            return new ContentHubDbContext(builder.Options);
        }
    }
}