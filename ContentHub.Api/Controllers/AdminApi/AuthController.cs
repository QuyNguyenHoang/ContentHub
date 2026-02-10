using ContentHub.Api.Extentions;
using ContentHub.Api.Services;
using ContentHub.Application.Models.Auth;
using ContentHub.Application.Models.System;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;

namespace ContentHub.Api.Controllers.AdminApi
{
    [Route("api/admin/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly Services.IEmailSender _emailSender;

        public AuthController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            RoleManager<AppRole> roleManager,
            ITokenService tokenService,
            Services.IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _emailSender = emailSender;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthenticatedResult>> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null)
                return BadRequest("Invalid login request");

            var user = await _userManager.FindByNameAsync(loginRequest.UserName.Trim());
            if (user == null || !user.IsActive)
                return BadRequest("Đăng nhập không đúng");

            if (!user.EmailConfirmed)
                return BadRequest("Vui lòng xác thực Email để đăng nhập");

            if (await _userManager.IsLockedOutAsync(user))
                return BadRequest("Tài khoản đang bị khoá");

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                loginRequest.Password,
                lockoutOnFailure: true
            );

            if (!result.Succeeded)
                return BadRequest("Đăng nhập không đúng");

            // ===== AUTHORIZATION =====
            var roles = await _userManager.GetRolesAsync(user);
            var permissions = await GetPermissionsByUserIdAsync(user.Id.ToString());

            // ===== CLAIMS =====
            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
        new Claim(UserClaims.FirstName, user.FirstName ?? string.Empty),
        new Claim(UserClaims.Roles, string.Join(";", roles)),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            // ===== ADD PERMISSIONS (QUAN TRỌNG NHẤT) =====
            foreach (var permission in permissions)
            {
                claims.Add(new Claim("permission", permission));
            }

            // ===== TOKEN =====
            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
            await _userManager.UpdateAsync(user);

            return Ok(new AuthenticatedResult
            {
                Token = accessToken,
                RefreshToken = refreshToken
            });
        }

        // ================= PERMISSION LOGIC =================

        private async Task<List<string>> GetPermissionsByUserIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) { return new List<string>(); }
            var roles = await _userManager.GetRolesAsync(user);
            var permissions = new List<string>();

            var allPermissions = new List<RoleClaimsDto>();
            if (roles.Contains(Roles.Admin))
            {
                var types = typeof(Permissions).GetTypeInfo().DeclaredNestedTypes;
                foreach (var type in types)
                {
                    allPermissions.GetPermissions(type);
                }
                permissions.AddRange(allPermissions.Select(x => x.Value));
            }
            else
            {
                foreach (var roleName in roles)
                {
                    var role = await _roleManager.FindByNameAsync(roleName);
                    if (role == null) { return new List<string>(); }
                    var claims = await _roleManager.GetClaimsAsync(role);
                    var roleClaimValues = claims.Select(x => x.Value).ToList();
                    permissions.AddRange(roleClaimValues);
                }
            }
            return permissions.Distinct().ToList();
        }
        // ================= REGISTER =================
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Dob = dto.Dob,
                IsActive = true,
                DateCreated = DateTime.UtcNow,
                EmailConfirmed = false
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            // gán role USER
            await _userManager.AddToRoleAsync(user, "admin");

            // tạo token confirm
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = Uri.EscapeDataString(token);

            var confirmUrl =
                $"{Request.Scheme}://{Request.Host}/api/admin/auth/confirm-email" +
                $"?userId={user.Id}&token={encodedToken}";

            await _emailSender.SendEmailAsync(
                user.Email!,
                "Confirm your email",
                $@"
                <h3>Welcome to ContentHub 👋</h3>
                <p>Click link below to confirm email:</p>
                <a href='{confirmUrl}'>Confirm Email</a>
                ");

            return Ok("Register success. Please check email to confirm.");
        }

        // ================= CONFIRM EMAIL =================
        [HttpGet("confirm-email")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(
            [FromQuery] Guid userId,
            [FromQuery] string token)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return BadRequest("User not found");

            if (user.EmailConfirmed)
                return Ok("Email already confirmed");

            var decodedToken = Uri.UnescapeDataString(token);

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            return Ok("Email confirmed successfully");
        }
    }
}




