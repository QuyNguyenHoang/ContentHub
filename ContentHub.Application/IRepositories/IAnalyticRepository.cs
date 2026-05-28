using ContentHub.Application.Models.AnalyticDto;
using ContentHub.Application.Models.System;

namespace ContentHub.Application.IRepositories
{
    public interface IAnalyticRepository
    {
        Task<List<UserDto>> TopUserByPostAsync();
        Task<TotalPostCountResponseDto> GetTotalPostAsync(TimeRange timeRange);
    }
}
