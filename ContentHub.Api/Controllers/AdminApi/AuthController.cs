using ContentHub.Api.Services;
using ContentHub.Application.IRepositories.Auth;
using ContentHub.Application.Models.Auth;
using ContentHub.Application.Models.Auth.Register;
using ContentHub.Domain.Data.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers.AdminApi
{
    [Route("api/admin/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;


        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;

        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _authRepository.LoginAsync(loginRequest);
            Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30),
            });

            return Ok(new
            {
                Token = result.Token,
            });
        }

        //Refresh Token
        [HttpPost("refresh_token")]
        public async Task<ActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            

            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("Missing refresh token");
            }

            var result = await _authRepository.RefreshTokenAsync(refreshToken);

            Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30)
            });

            return Ok(new
            {
                accessToken = result.Token
            });
        }

        // ================= PERMISSION LOGIC =================


        // ================= REGISTER =================
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authRepository.NewUserAsync(registerDto);

            var encodedToken = Uri.EscapeDataString(result.Token);

            var confirmUrl =
                $"{Request.Scheme}://{Request.Host}/api/admin/auth/confirm-email" +
                $"?userId={result.UserId}&token={encodedToken}";

            await _authRepository.SendMailConfirmAsync(result.Email, confirmUrl);


            return Ok("Register success. Please check email to confirm.");
        }

        // ================= CONFIRM EMAIL =================
        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(
    [FromQuery] Guid userId,
    [FromQuery] string token)
        {
            var result = await _authRepository.ConfirmEmailAsync(userId, token);

            return Ok(result);
        }
    }
}




