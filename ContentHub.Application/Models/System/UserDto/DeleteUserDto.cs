namespace ContentHub.Application.Models.System.UserDto
{
    public class DeleteUserDto
    {
        public required Guid[] Ids { get; set; }   
        public bool IsSoftDelete { get; set; }

    }
}
