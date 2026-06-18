using ContentHub.Domain.Data.Identity;

namespace ContentHub.Application.Models.System.UserDto
{
    public static class UserMapper
    {
        public static UserResponseDto ToResponse(this AppUser user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive,
                DateCreated = user.DateCreated,
                Dob = user.Dob,
                Avatar = user.Avatar,
                LastLoginDate = user.LastLoginDate,
                UserName = user.UserName!,
                Email = user.Email!,
                EmailConfirmed = user.EmailConfirmed,
                TotalPost = user.Posts?.Count ?? 0
            };
        }
    }
}