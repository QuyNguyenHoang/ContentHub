using Microsoft.AspNetCore.Identity;

namespace ContentHub.Domain.Data.Identity
{
    public class AppUserRole : IdentityUserRole<Guid>
    {
        public AppUser User { get; set; } = null!;

        public AppRole Role { get; set; } = null!;
    }
}
