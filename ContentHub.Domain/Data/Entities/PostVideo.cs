using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("PostVideos")]
    [Index(nameof(PostId))]
    public class PostVideo
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(250)] 
        public string? Name { get; set; }
        [MaxLength(250)]
        public string? Url { get; set; }
        public int? SortOrder { get; set; }
        public string? Description { get; set; }
        public Guid PostId { get; set; }
        public Post? Post { get; set; }
    }
}
