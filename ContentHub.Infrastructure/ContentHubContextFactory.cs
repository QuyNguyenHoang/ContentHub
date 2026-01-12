using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace ContentHub.Infrastructure
{
    public class ContentHubContextFactory : IDesignTimeDbContextFactory<ContentHubDbContext>
    {
       public ContentHubDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var builder = new DbContextOptionsBuilder<ContentHubDbContext>();
            builder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            return new ContentHubDbContext(builder.Options);
        }
    }
}
