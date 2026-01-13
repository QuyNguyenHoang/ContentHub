using ContentHub.Domain.Data.Identity;
using Microsoft.AspNetCore.Identity;

namespace ContentHub.Infrastructure
{
    public class DataSeeder
    {
        public async Task SeedAsync(ContentHubDbContext context)
        {
            var passwordHasher = new PasswordHasher<AppUser>();
            var rootAdminRoleId = Guid.NewGuid();
            if (!context.Roles.Any())
            {
                await context.Roles.AddAsync(new AppRole()
                {
                    Id = rootAdminRoleId,
                    Name = "admin",
                    NormalizedName = "ADMIN",
                    DisplayName = "Quản trị viên"

                });
                await context.SaveChangesAsync();
            }
            if (!context.Users.Any())
            {
                var userId = Guid.NewGuid();
                var user = new AppUser()
                {
                    Id = userId,
                    FirstName = "Nguyễn",
                    LastName = "Hoàng Quý",
                    UserName = " QuyNguyen",
                    NormalizedUserName = "QUYNGUYEN",
                    Email = "proemie2003@gmail.com",
                    NormalizedEmail = "PROEMIE2003@GMAIL.COM",
                    IsActive = true,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    LockoutEnabled = false,
                    DateCreated = DateTime.Now,
                };
                user.PasswordHash = passwordHasher.HashPassword(user, "quy@123");
                await context.Users.AddAsync(user);
                await context.UserRoles.AddAsync(new IdentityUserRole<Guid>()
                {
                    RoleId = rootAdminRoleId,
                    UserId = userId
                });
                await context.SaveChangesAsync();

            }


        }

    }
}
