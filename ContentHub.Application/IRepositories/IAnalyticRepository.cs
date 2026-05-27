using ContentHub.Application.Models.System;

namespace ContentHub.Application.IRepositories
{
    public interface IAnalyticRepository
    {
        Task<List<UserDto>> TopUserByPostAsync();
    }
}
