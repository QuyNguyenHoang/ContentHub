using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace ContentHub.Infrastructure
{
    public class DataSeeder
    {
        public async Task SeedAsync(ContentHubDbContext context)
        {
            var passwordHasher = new PasswordHasher<AppUser>();

            // ===================== ROLE =====================
            var adminRole = await context.Roles
                .FirstOrDefaultAsync(r => r.NormalizedName == "ADMIN");

            if (adminRole == null)
            {
                adminRole = new AppRole
                {
                    Id = Guid.NewGuid(),
                    Name = "admin",
                    NormalizedName = "ADMIN",
                    DisplayName = "Quản trị viên"
                };

                context.Roles.Add(adminRole);
                await context.SaveChangesAsync();
            }

            // ===================== USER =====================
            var adminUser = await context.Users
                .FirstOrDefaultAsync(u => u.NormalizedUserName == "QUYNGUYEN");

            if (adminUser == null)
            {
                adminUser = new AppUser
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Nguyễn",
                    LastName = "Hoàng Quý",
                    UserName = "QuyNguyen",
                    NormalizedUserName = "QUYNGUYEN",
                    Email = "proemie2003@gmail.com",
                    NormalizedEmail = "PROEMIE2003@GMAIL.COM",
                    IsActive = true,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    LockoutEnabled = false,
                    DateCreated = DateTime.Now,
                    EmailConfirmed = true
                };

                adminUser.PasswordHash =
                    passwordHasher.HashPassword(adminUser, "quy@123");

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
            }

            // ===================== USER ROLE =====================
            var userRoleExists = await context.UserRoles.AnyAsync(ur =>
                ur.UserId == adminUser.Id && ur.RoleId == adminRole.Id);

            if (!userRoleExists)
            {
                context.UserRoles.Add(new IdentityUserRole<Guid>
                {
                    UserId = adminUser.Id,
                    RoleId = adminRole.Id
                });

                await context.SaveChangesAsync();
            }

            // ===================== ROLE PERMISSIONS =====================
            var existingClaims = await context.RoleClaims
                .Where(rc => rc.RoleId == adminRole.Id)
                .Select(rc => rc.ClaimValue)
                .ToListAsync();

            var permissionTypes = typeof(Permissions)
                .GetTypeInfo()
                .DeclaredNestedTypes;

            foreach (var type in permissionTypes)
            {
                var fields = type.GetFields(BindingFlags.Public | BindingFlags.Static);

                foreach (var field in fields)
                {
                    var permissionValue = field.GetValue(null)?.ToString();
                    if (permissionValue == null) continue;

                    if (!existingClaims.Contains(permissionValue))
                    {
                        context.RoleClaims.Add(new IdentityRoleClaim<Guid>
                        {
                            RoleId = adminRole.Id,
                            ClaimType = "permission",
                            ClaimValue = permissionValue
                        });
                    }
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
