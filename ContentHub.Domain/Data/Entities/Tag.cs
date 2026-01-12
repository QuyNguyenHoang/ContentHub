using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("Tags")]
    [Index(nameof(Slug), IsUnique = true)]
    public class Tag
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(250)]
        [Required]
        public required string Name { get; set; }
        [MaxLength(250)]
        [Required]
        [Column(TypeName = "varchar(250)")]
        public required string Slug { get; set; }

    }
}
