using AutoMapper;
using ContentHub.Domain.Data.Identity;

namespace ContentHub.Application.Models.System.UserDto
{
    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public string FullName => $"{FirstName} {LastName}";

        public bool IsActive { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateOnly? Dob { get; set; }   // nullable

        public string? Avatar { get; set; }

        public DateTime? LastLoginDate { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public bool EmailConfirmed { get; set; }
        public int TotalPost { get; set; }
        public int TotalUser { get; set; }
        public bool IsAdmin { get; set; }
        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                CreateMap<AppUser, UserResponseDto>();
            }
        }
    }
}