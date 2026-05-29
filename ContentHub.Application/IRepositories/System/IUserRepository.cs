using ContentHub.Application.Models;
using ContentHub.Application.Models.System;

namespace ContentHub.Application.IRepositories.System
{
    public interface IUserRepository
    {
        Task<PagedResult<UserDto>> GetUserPaging(string? filter, string? keyword, int pageNumber = 1, int pageSize = 10);
    }
}
