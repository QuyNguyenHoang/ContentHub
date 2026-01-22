using ContentHub.Api.Services;
using ContentHub.Application.Models.Auth;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

namespace ContentHub.Api.Controllers.AdminApi
{
    [Route("api/admin/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService  _tokenService;
        public AuthController(UserManager<AppUser> userManager
            , SignInManager<AppUser> signInManager
            , ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<ActionResult<AuthenticatedResult>> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null)
                return BadRequest("Invalid login request");

            var user = await _userManager.FindByNameAsync(loginRequest.UserName);
            if (user == null || !user.IsActive)
                return BadRequest("Đăng nhập không đúng");

            // Check lockout thật sự
            if (await _userManager.IsLockedOutAsync(user))
                return BadRequest("Tài khoản đang bị khoá");

            var result = await _signInManager.PasswordSignInAsync(
                user,
                loginRequest.Password,
                isPersistent: false,
                lockoutOnFailure: true
            );

            if (!result.Succeeded)
                return BadRequest("Đăng nhập không đúng");

            // ===== AUTHORIZATION (tạm thời chỉ ROLE) =====
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? ""),
                new Claim(UserClaims.FirstName, user.FirstName ?? ""),
                new Claim(UserClaims.Roles, string.Join(";", roles)),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(30);
            await _userManager.UpdateAsync(user);

            return Ok(new AuthenticatedResult
            {
                Token = accessToken,
                RefreshToken = refreshToken
            });
        }



    }
}
