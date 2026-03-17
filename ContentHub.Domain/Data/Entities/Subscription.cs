using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("Subscriptions")]
    public class Subscription
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(250)]
        public string? PlanCode { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
        [Column(TypeName = "Decimal(18,2)")]
        public decimal Price { get; set; }
        public bool IsGift { get; set; }
        public Guid? GrantedByUserId { get; set; }
        [MaxLength(500)]
        public string? GrantedByUserName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? CancelledDate { get; set; }
        public bool IsActive { get; set; }
        public Guid UserId { get; set; }
    }
}
