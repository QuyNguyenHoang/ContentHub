using ContentHub.Application.Models.Auth;
using ContentHub.Application.Models.Auth.Register;
using ContentHub.Domain.Data.Identity;

namespace ContentHub.Application.IRepositories.Auth
{
    public interface IAuthRepository
    {
        //Login
        Task<AuthenticatedResult>  LoginAsync(LoginRequest loginRequest);
        //Get permissions
        Task<List<string>> GetPermissionsByUserIdAsync(string userId);
        //refresh Token
        Task<AuthenticatedResult> RefreshTokenAsync(string refreshToken);
        //Register Account
        Task<RegisterResponseDto> NewUserAsync(RegisterRequestDto registerDto);
        //Send Email Confirm After Register
        Task SendMailConfirmAsync(string email, string confirmUrl);
        //Confirm email
        Task<string> ConfirmEmailAsync(Guid userId, string token);
    }
}
