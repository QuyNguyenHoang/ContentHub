using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;

namespace ContentHub.Application.IRepositories
{
    public interface IPostRepository : IRepository<Post, Guid>
    {
        Task<PagedResult<PostInListDto>> GetAllPaging(string? keyword, Guid? CategoryId, int pageIndex = 1, int pageSize = 10);
        Task<bool> IsSlugAlreadyExistedAsync(string slug, Guid? currentId = null);

        
    }
}
