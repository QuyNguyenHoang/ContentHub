using Microsoft.AspNetCore.Authorization;

namespace ContentHub.Api.Authorization
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public string Permission { get; private set; }
        public PermissionRequirement(string permissions)
        {
            Permission = permissions;
        }
    }
}
