namespace ContentHub.Application.Models.System.UserDto
{
    public class UpdateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        public DateOnly? Dob { get; set; }

        public string? Avatar { get; set; }

    }
}

