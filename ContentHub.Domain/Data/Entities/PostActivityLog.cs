using ContentHub.Domain.Data.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static ContentHub.Domain.SeedWorks.Constant.Permissions;

namespace ContentHub.Domain.Data.Entities
{
    [Table("PostActivityLogs")]
    [Index(nameof(PostId))]
    public class PostActivityLog
    {
        [Key]
        public required Guid Id { get; set; }
        public PostStatus FromStatus { get; set; }
        public PostStatus ToStatus { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public string? Note { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid PostId { get; set; }
        public Post? Post { get; set; }
        public AppUser? User { get; set; }
    }
}
