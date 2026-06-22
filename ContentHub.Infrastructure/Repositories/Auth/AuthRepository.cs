using Azure;
using ContentHub.Application.Extensions;
using ContentHub.Application.IRepositories.Auth;
using ContentHub.Application.IService;
using ContentHub.Application.Models.Auth;
using ContentHub.Application.Models.Auth.Register;
using ContentHub.Application.Models.System;
using ContentHub.Domain.Data.Identity;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static ContentHub.Domain.SeedWorks.Constant.Permissions;

namespace ContentHub.Infrastructure.Repositories.Auth
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailSevice;

        public AuthRepository(UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            RoleManager<AppRole> roleManager,
            ITokenService tokenService,
             IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _emailSevice = emailService;
        }
        //Hasing Token 
        private static string HashRefreshToken(string refreshToken)
        {
            return Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken))
            );
        }
        //Login 
        public async Task<AuthenticatedResult> LoginAsync(LoginRequest loginRequest)
        {
            var user = await _userManager.FindByNameAsync(loginRequest.UserName.Trim());

            if (user == null || !user.IsActive)
            {
                throw new UnauthorizedAccessException("Username or Password is Incorrect!!!");
            }
            if (await _userManager.IsLockedOutAsync(user))
            {
                throw new UnauthorizedAccessException("Your account is locked!");
            }
            if (!user.EmailConfirmed)
            {
                throw new UnauthorizedAccessException("Please verify your Email first!");
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user,
                loginRequest.Password,
                lockoutOnFailure: true);
            if (result.IsLockedOut)
            {
                throw new UnauthorizedAccessException("Your account is locked!");
            }
            if (!result.Succeeded)
            {
                var failedCount = await _userManager.GetAccessFailedCountAsync(user);
                var maxAttempts = _userManager.Options.Lockout.MaxFailedAccessAttempts;
                var remainingAttempts = maxAttempts - failedCount;

                throw new UnauthorizedAccessException(
                    $"Invalid username or password. {remainingAttempts} attempts remaining.");
            }
            await _userManager.ResetAccessFailedCountAsync(user);
            //generate Token
            return await GenerateTokenPairAsync(user);

        }
        //Login with Auth0 (google)
        public async Task<AuthenticatedResult> Auth0LoginAsync(string auth0Token)
        {
            var handler = new JwtSecurityTokenHandler();

            if (!handler.CanReadToken(auth0Token))
                throw new UnauthorizedAccessException("Invalid token");

            var jwt = handler.ReadJwtToken(auth0Token);

            var auth0Id = jwt.Claims
                .FirstOrDefault(x => x.Type == "sub")
                ?.Value;

            var email = jwt.Claims
                .FirstOrDefault(x => x.Type == "email")
                ?.Value;

            var name = jwt.Claims
                .FirstOrDefault(x => x.Type == "name")
                ?.Value;

            var picture = jwt.Claims
                .FirstOrDefault(x => x.Type == "picture")
                ?.Value;

            if (string.IsNullOrWhiteSpace(auth0Id))
                throw new UnauthorizedAccessException("Missing Auth0 user id");

            // Tìm theo Auth0 UserId
            var user = await _userManager.Users
                .FirstOrDefaultAsync(x => x.ProviderUserId == auth0Id);

            // Chưa có user => tạo mới
            if (user == null)
            {
                user = new AppUser
                {
                    Id = Guid.NewGuid(),
                    ProviderUserId = auth0Id,
                    Email = email,
                    UserName = email,
                    Avatar = picture,
                    LoginProvider = "Google",
                    IsActive = true,
                    DateCreated = DateTime.UtcNow
                };

                var createResult = await _userManager.CreateAsync(user);

                if (!createResult.Succeeded)
                {
                    throw new Exception(
                        string.Join(", ", createResult.Errors.Select(x => x.Description))
                    );
                }

                await _userManager.AddToRoleAsync(
                    user,
                    Domain.SeedWorks.Constant.Roles.User
                );
            }
            else
            {
                // cập nhật thông tin mới nhất từ Auth0
                user.Email = email;
                user.UserName = email;
                user.Avatar = picture;

                await _userManager.UpdateAsync(user);
            }

            return await GenerateTokenPairAsync(user);
        }
        //Generate Access + RefrehToken Token
        private async Task<AuthenticatedResult> GenerateTokenPairAsync(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var permissions = await GetPermissionsByUserIdAsync(user.Id.ToString());
            //Get Claim
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
            //add permisions
            foreach (var permission in permissions)
            {
                claims.Add(new Claim(AppClaimTypes.Permission, permission));
            }
            //Token 
            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();
            var refreshTokenHash = HashRefreshToken(refreshToken);
            user.RefreshToken = refreshTokenHash;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                throw new Exception("Cannot update refresh token");
            return new AuthenticatedResult
            {
                Token = accessToken,
                RefreshToken = refreshToken,
            };

        }
        //Generate Access Token
        private async Task<string> GenerateAccessTokenAsync(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var permissions = await GetPermissionsByUserIdAsync(user.Id.ToString());
            //Get Claim
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
            //add permisions
            foreach (var permission in permissions)
            {
                claims.Add(new Claim(AppClaimTypes.Permission, permission));
            }
            //Token 
            var accessToken = _tokenService.GenerateAccessToken(claims);
            return accessToken;
        }
        //refresh Token
        public async Task<AuthenticatedResult> RefreshTokenAsync(string refreshToken)
        {
            var refreshTokenHash = HashRefreshToken(refreshToken);

            var hash = await _userManager.Users.Where(u => u.UserName == "QuyNguyen").Select(u => u.RefreshToken).FirstOrDefaultAsync();
            var user = await _userManager.Users.Where(u => u.RefreshToken == refreshTokenHash).FirstOrDefaultAsync();
            Console.WriteLine("COOKIE: " + refreshToken);
            Console.WriteLine("Hash" + hash);
            Console.WriteLine("HASH COOKIE: " + HashRefreshToken(refreshToken));
            if (user == null)
            {
                throw new ArgumentException("User not found!");
            }
            if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Refresh token expired");
            }
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            var newRefreshTokenHash = HashRefreshToken(newRefreshToken);
            user.RefreshToken = newRefreshTokenHash;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                throw new Exception("Cannot update refresh token");
            var accessToken = await GenerateAccessTokenAsync(user);
            return new AuthenticatedResult
            {
                Token = accessToken,
                RefreshToken = newRefreshToken
            };
        }
        //Get permissions by UserId
        public async Task<List<string>> GetPermissionsByUserIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found!");
            }
            var roles = await _userManager.GetRolesAsync(user);
            var permissions = new List<string>();
            var allPermissions = new List<RoleClaimsDto>();
            if (roles.Contains(Domain.SeedWorks.Constant.Roles.Admin))
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
                    if (role == null)
                    {
                        throw new ArgumentException("Role not found!");
                    }
                    var claims = await _roleManager.GetClaimsAsync(role);
                    var roleClaimValues = claims.Select(x => x.Value).ToList();
                    permissions.AddRange(roleClaimValues);
                }
            }
            return permissions.Distinct().ToList();

        }

        public async Task<RegisterResponseDto> NewUserAsync(RegisterRequestDto registerDto)
        {
            var userName = await _userManager.Users.Where(u => u.UserName == registerDto.UserName).AnyAsync();
            if (userName)
            {
                throw new ArgumentException("Username Already Existed!");
            }
            var userEmail = await _userManager.Users.Where(u => u.Email == registerDto.Email).AnyAsync();
            if (userEmail)
            {
                throw new ArgumentException("Username Already Existed!");
            }
            var user = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                Dob = registerDto.Dob,
                DateCreated = DateTime.UtcNow,
                EmailConfirmed = false,
                IsActive = true,

            };
            var addUser = await _userManager.CreateAsync(user);
            if (!addUser.Succeeded)
            {
                throw new ArgumentException("Register Acount failed!");
            }
            await _userManager.AddToRoleAsync(user, Domain.SeedWorks.Constant.Roles.User);
            //create Token
            var tokenConfirmEmail = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            return new RegisterResponseDto
            {
                UserId = user.Id,
                Token = tokenConfirmEmail,
                Email = user.Email!
            };
        }

        public async Task SendMailConfirmAsync(string email, string confirmUrl)
        {
            await _emailSevice.SendEmailAsync(
                email,
                "Confirm your Email to complete registration",
               $@"
<div style='font-family: Arial, sans-serif; background-color:#f6f7fb; padding:30px;'>
    <div style='max-width:600px; margin:0 auto; background:#ffffff; padding:30px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);'>

        <h2 style='color:#333;'>Welcome to ContentHub 👋</h2>

        <p style='font-size:16px; color:#555;'>
            Thank you for registering. Please verify your email to activate your account.
        </p>

        <div style='text-align:center; margin:30px 0;'>
            <a href='{confirmUrl}'
               style='background-color:#4f46e5; color:white; padding:12px 24px;
                      text-decoration:none; border-radius:8px; font-weight:bold;
                      display:inline-block;'>
                Verify Email
            </a>
        </div>

        <p style='font-size:14px; color:#777;'>
            If you did not create this account, you can ignore this email.
        </p>

        <hr style='border:none; border-top:1px solid #eee; margin:20px 0;' />

        <p style='font-size:12px; color:#aaa; text-align:center;'>
            © ContentHub - All rights reserved
        </p>

    </div>
</div>
"
            );
        }
        //Confirm Email
        public async Task<string> ConfirmEmailAsync(Guid userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
                throw new ArgumentException("User not found");

            if (user.EmailConfirmed)
                return "Email already confirmed";

            var decodedToken = Uri.UnescapeDataString(token);

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
                throw new ArgumentException(
                    string.Join(", ", result.Errors.Select(e => e.Description))
                );

            return "Email confirmed successfully";
        }
    }
}
