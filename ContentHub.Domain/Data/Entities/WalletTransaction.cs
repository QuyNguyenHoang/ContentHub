using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Entities
{
    [Table("WalletTransactions")]
    public class WalletTransaction
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid WalletId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }   

        public WalletTransactionDirection Direction { get; set; }
        public WalletTransactionType TransactionType { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal BalanceAfter { get; set; }  

        public Guid? ReferenceId { get; set; }     

        public string? Note { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
    public enum WalletTransactionDirection : byte
    {
        Credit = 1, // + tiền
        Debit = 2   // - tiền
    }
    public enum WalletTransactionType : byte
    {
        Deposit = 1,
        Withdraw = 2,
        PurchasePost = 3, //Mua bai viet
        Subscription = 4, // Mua goi
        Refund = 5, //Hoan tien
        Royalty = 6
    }
}
