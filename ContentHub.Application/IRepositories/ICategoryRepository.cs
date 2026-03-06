using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;

namespace ContentHub.Application.IRepositories
{
    public interface ICategoryRepository : IRepository<PostCategory, Guid>
    {
        Task<bool> CategoryExistsAsync(Guid categoryId);
        Task<PagedResult<PostCategoriesDto>> GetAllCategoriesAsync(string? keyword, int pageNumber = 1, int pageSize = 10);
        Task<bool> HasPostAsync(Guid postId);
        Task<PostCategoriesDto> GetBySlug(string slug);
        Task<List<CategoryMenuDto>> MenuCategoryAsync();
    }
}
