using ContentHub.Domain.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContentHub.Domain.Data.Identity
{
    [Table("AppUsers")]
    [Index(nameof(UserId), IsUnique = true)]
    [Index(nameof(ProviderUserId), IsUnique = true)]
    public class AppUser : IdentityUser<Guid>
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        [Required]
        [MaxLength(100)]
        public  string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public DateOnly? Dob { get; set; }

        [MaxLength(500)]
        public string? Avatar { get; set; }
        public DateTime? LastLoginDate { get; set; }
        //Auth0 login
        [MaxLength(50)]
        public string LoginProvider { get; set; } = "Local";
        [MaxLength(150)]
        public string? ProviderUserId { get; set; }


        public ICollection<Post> Posts { get; set; } = new List<Post>();
        //public ICollection<AppUserRole> UserRoles { get; set; } = new List<AppUserRole>();
        public string GetFullName()
        {
            return this.FirstName + " " + this.LastName;
        }
    }
}
