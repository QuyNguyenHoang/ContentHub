using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("SubscriptionPayments")]
    public class SubscriptionPayment
    {
        [Key]
        public Guid Id { get; set; }
        [Column(TypeName = "Decimal(18,2)")]
        public decimal Amount { get; set; }
        [MaxLength(250)]
        public string? PaymentMethod { get; set; }
        [MaxLength(500)]
        public string? TransactionId { get; set; }
        public DateTime? PaymentDate { get; set; }
        public DateTime? ConfirmedDate { get; set; }
        public bool? Status { get; set; }
        public string? FailureReason { get; set; }
        public Guid UserId { get; set; }
        public Guid SubscriptionId { get; set; }
    }
}
