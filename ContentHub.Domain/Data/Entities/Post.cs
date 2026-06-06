using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("Posts")]
    [Index(nameof(Slug), IsUnique = true)]
    public class Post
    {
        [Key]
        public  Guid Id { get; set; }
        [MaxLength(250)]
        public required string Name { get; set; }
        [MaxLength(250)]
        [Column(TypeName = ("varchar(250)"))]
        [Required]
        public required string Slug { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public string? Source { get; set; }
        public PostStatus Status { get; set; }
        public int ViewCount { get; set; }
        public string? Tags { get; set; }
        [MaxLength(250)]
        public string? SeoKeywords { get; set; }
        [MaxLength(500)]
        public string? SeoDescription { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public DateTime? DateModified { get; set; }
        public bool IsPaid { get; set; }
        public bool IsDeleted { get; set; }
        [Column(TypeName = "Decimal(18,2)")]
        public decimal RoyaltyAmount { get; set; }
        public string CoverImageId { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
        public PostCategory? Category { get; set; }
        public Guid AuthorUserId {  get; set; }
        public AppUser? Author { get; set; } 
        public ICollection<PostPicture> Picture { get; set; } = new List<PostPicture>();
        public ICollection<PostActivityLog> ActivityLogs { get; set; } = new List<PostActivityLog>();
        public ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
        public ICollection<PostSeries> PostSeries { get; set; } = new List<PostSeries>();
    }
    public enum PostStatus:byte
    {
        Draft = 0,
        Pending = 1,
        Rejected = 2,
        Published = 3,
    }
}
