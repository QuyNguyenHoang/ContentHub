using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("PostSeries")]
    [PrimaryKey(nameof(PostId), nameof(SeriesId))]
    public class PostSeries
    {
        public Guid SeriesId { get; set; }
        public Guid PostId { get; set; }
        public int SortOrder { get; set; }
    }
}
