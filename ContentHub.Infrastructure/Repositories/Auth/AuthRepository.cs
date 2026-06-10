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

namespace ContentHub.Infrastructure.Repositories.Auth
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailSender _emailSender;

        public AuthRepository(UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            RoleManager<AppRole> roleManager,
            ITokenService tokenService,
             IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _emailSender = emailSender;
        }
        //Login 
        public async Task<AppUser> LoginAsync(LoginRequest loginRequest)
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
        return await GenerateAccessTokenAsync(user);
           



        }

        //Generate Access Token
        private async Task<AuthenticatedResult> GenerateAccessTokenAsync(AppUser user)
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
            user.RefreshToken = refreshToken;
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
        //refresh Token
        public async Task<AuthenticatedResult> RefreshTokenAsync(string refreshToken)
        {

            var user = await _userManager.Users.Where(u => u.RefreshToken == refreshToken).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new ArgumentException("User not found!");
            }
            if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new ArgumentException("Refresh token expired!");
            }
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                throw new Exception("Cannot update refresh token");
            return await GenerateAccessTokenAsync(user);
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
            await _userManager.AddToRoleAsync(user, Roles.User);
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
            await _emailSender.SendEmailAsync(
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
