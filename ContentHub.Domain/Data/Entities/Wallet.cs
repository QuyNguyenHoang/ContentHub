using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("Wallets")]
    public class Wallet
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(250)]
        public string? Name { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool IsActive { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public  decimal Balance { get; private set; } = 0;
        public DateTime? DateUpdate { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; } = default!;
        public Guid UserId { get; set; }    
    }
}
