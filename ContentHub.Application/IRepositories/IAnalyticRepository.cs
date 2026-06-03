using ContentHub.Application.Models.AnalyticDto;
using ContentHub.Application.Models.System.UserDto;

namespace ContentHub.Application.IRepositories
{
    public interface IAnalyticRepository
    {
        Task<List<UserResponseDto>> TopUserByPostAsync();
        Task<TotalPostCountResponseDto> GetTotalPostAsync(TimeRange timeRange);
        Task<TotalUserCountResponseDto> GetTotalUserAsync(TimeRange timeRange);
    }
}
