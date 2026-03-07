using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;

namespace ContentHub.Application.IRepositories
{
    public interface ITagRepository
    {
        Task<PagedResult<TagDto>> GetAllTagsAsync(string? keyword, int pageNumber = 1, int pageSize = 10);
        Task<bool> NameOrSlugExistAsync(string name, string slug);
        Task<List<TagDto>> GetTagDropdown();
        Task<TagDto?> GetTagBySlugAsync(string slug);
    }
}
