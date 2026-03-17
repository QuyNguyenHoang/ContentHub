using ContentHub.Application.Models.System;
using ContentHub.Domain.Data.Identity;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel;
using System.Reflection;
using System.Security.Claims;
using static ContentHub.Api.Controllers.RoleController;

namespace ContentHub.Api.Extentions
{
    public static class ClaimExtensions
    {
        public static void GetPermissions(this List<RoleClaimsDto> allPermissions, Type policy)
        {
            if (policy == null) throw new ArgumentNullException(nameof(policy));
            if (allPermissions == null) throw new ArgumentNullException(nameof(allPermissions));

            var fields = policy.GetFields(BindingFlags.Static | BindingFlags.Public);

            foreach (var fi in fields)
            {
                // Lấy value an toàn
                var value = fi.GetValue(null)?.ToString();
                if (string.IsNullOrWhiteSpace(value))
                    continue;

                // Lấy description nếu có
                var attributes = fi.GetCustomAttributes(typeof(DescriptionAttribute), true);

                var displayName = attributes.Length > 0
                    ? ((DescriptionAttribute)attributes[0]).Description
                    : value;

                // Add vào list
                allPermissions.Add(new RoleClaimsDto
                {
                    Value = value,
                    Type = AppClaimTypes.Permission,
                    DisplayName = displayName
                });
            }
        }

        public static async Task AddPermissionClaim(
            this RoleManager<AppRole> roleManager,
            AppRole role,
            string permission)
        {
            if (roleManager == null) throw new ArgumentNullException(nameof(roleManager));
            if (role == null) throw new ArgumentNullException(nameof(role));
            if (string.IsNullOrWhiteSpace(permission)) return;

            var allClaims = await roleManager.GetClaimsAsync(role);

            var exists = allClaims.Any(c =>
                c.Type == AppClaimTypes.Permission &&
                c.Value == permission);

            if (!exists)
            {
                await roleManager.AddClaimAsync(
                    role,
                    new Claim(AppClaimTypes.Permission, permission));
            }
        }
    }
}