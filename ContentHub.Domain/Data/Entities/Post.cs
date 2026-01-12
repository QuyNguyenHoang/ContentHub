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
        [Column(TypeName = "Decimal(18,2)")]
        public decimal RoyaltyAmout { get; set; }
        [Required]
        public Guid CategoryId { get; set; }

    }
    public enum PostStatus
    {
        Draft = 0,
        WaitingForApproval = 1,
        Rejected = 2,
        Published = 3,
    }
}
