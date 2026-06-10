using System.ComponentModel.DataAnnotations;

namespace ContentHub.Application.Models.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "User Name is required")]
        public required string UserName { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public required string Password { get; set; }
    }
}
