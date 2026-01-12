using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("PostSeries")]
    public class PostSeries
    {
        [Key]
        public Guid Id { get; set; }
        public Guid SeriesId { get; set; }
        public Guid PostId { get; set; }
        public int SortOrder { get; set; }
    }
}
