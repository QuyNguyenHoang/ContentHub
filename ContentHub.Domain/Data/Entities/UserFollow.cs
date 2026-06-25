using ContentHub.Domain.Data.Identity;
using static ContentHub.Domain.SeedWorks.Constant.Permissions;

namespace ContentHub.Domain.Data.Entities
{
    public class UserFollow
    {
        public Guid FollowerId { get; set; }     // Người theo dõi
        public AppUser Follower { get; set; } = null!;

        public Guid FollowingId { get; set; }    // Người được theo dõi
        public AppUser Following { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
