using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("Series")]
    [Index(nameof(Slug), IsUnique = true)]
    public class Series
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(250)]
        [Required]
        public string Name { get; set; } = "No Name";

        public string? Description { get; set; }
        [Column(TypeName = "varchar(250)")]
        public required string Slug { get; set; }
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; }
        [MaxLength(250)]
        public string? SeoKeywords { get; set; }
        [MaxLength(500)]
        public string? SeoDescription { get; set; }
        [MaxLength(500)]
        public string? Thumbnail { get;set; }
        public string? Content { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public Guid? UserId { get; set; }

    }
}
