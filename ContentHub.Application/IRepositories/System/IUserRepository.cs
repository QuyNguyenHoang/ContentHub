using ContentHub.Application.Models;
using ContentHub.Application.Models.System.UserDto;

namespace ContentHub.Application.IRepositories.System
{
    public interface IUserRepository
    {
        //Get user paging
        Task<PagedResult<UserResponseDto>> GetUserPagingAsync(string? filter, string? keyword, int pageNumber = 1, int pageSize = 10);
        //Update user
        Task<ApiResponse<UserResponseDto>> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto);
        //Delete User
        Task<ApiResponse<int>> DeleteUserAsync(DeleteUserDto deleteUserDto);
        //User detail
        Task<UserResponseDto> GetUserDetailAsync(Guid id);

    }
}
