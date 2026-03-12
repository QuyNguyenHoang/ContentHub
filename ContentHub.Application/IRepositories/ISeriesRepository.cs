using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;


namespace ContentHub.Application.IRepositories
{
    public interface ISeriesRepository
    {
        Task<PagedResult<SeriesDto>> GetAllSeriesPagingAsync(string? keyword, 
            int pageNumber = 1 , int pageSize = 10);
        Task<List<SeriesDto>> GetAllSeriesAsync();
        Task<SeriesDto> GetSeriesByIdAsync(Guid id);
        Task<SeriesDto> GetSeriesBySlug(string slug);
        Task RestoreSeries(Guid id);
        Task<bool> CheckNameOrSugAlreadyExistAsync(string name);
        Task <SeriesDto> AddNewSeriesAsync(SeriesRequestDto seriesRequest);
        Task<SeriesDto> UpdateSeriesAsync(Guid id, SeriesRequestDto seriesRequest);
        Task<int> DeleteSeriesAsync(Guid[] ids);
        Task<List<SeriesDto>> GetDropDownSeriesAsync();
    }
}
