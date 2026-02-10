using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace ContentHub.Api.Authorization
{
    public class PermissionAuthorizationHandler
        : AuthorizationHandler<PermissionRequirement>
    {
        private readonly RoleManager<AppRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;

        public PermissionAuthorizationHandler(
            RoleManager<AppRole> roleManager,
            UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            // 1. Chưa login → reject
            if (!context.User.Identity?.IsAuthenticated ?? true)
                return;

            // 2. Lấy userId từ JWT (CHUẨN)
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return;

            // 3. Lấy roles của user
            var roles = await _userManager.GetRolesAsync(user);

            // 4. Admin → pass tất cả
            if (roles.Contains(Roles.Admin))
            {
                context.Succeed(requirement);
                return;
            }

            // 5. Lấy permissions từ role claims
            foreach (var roleName in roles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null) continue;

                var claims = await _roleManager.GetClaimsAsync(role);

                var hasPermission = claims.Any(c =>
                    c.Type == "permission" &&
                    c.Value == requirement.Permission);
                    

                if (hasPermission)
                {
                    context.Succeed(requirement);
                    return;
                }
            }
        }
    }
}
