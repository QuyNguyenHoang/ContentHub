using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("PostActivityBlogs")]
    public class PostActivityBlog
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
    }
}
