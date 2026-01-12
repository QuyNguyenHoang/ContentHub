using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("PostTags")]
    public class PostTag
    {
        [Key]
        public Guid Guid { get; set; }
        public Guid PostId { get; set; }
        public Guid TagId { get; set; }
    }
}
