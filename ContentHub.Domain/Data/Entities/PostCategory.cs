using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("PostCategories")]
    [Index(nameof(Slug), IsUnique = true)]
    public class PostCategory
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(250)]
        [Required]
        public required string Name { get; set; }
        [MaxLength(250)]
        [Column(TypeName = "varchar(250)")]
        [Required]
        public required string Slug { get; set; }
        public Guid ParentId { get; set; }
        public bool IsActive { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public int? SortOrder { get; set; }
    }
}
