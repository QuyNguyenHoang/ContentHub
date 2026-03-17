using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;

namespace ContentHub.Application.IRepositories
{
    public interface IPostRepository : IRepository<Post, Guid>
    {
        Task<bool> IsSlugAlreadyExisted(string? slug,Guid? currentId = null);
        Task<PagedResult<PostDto>> GetPostPagingAsync(string? keyword, string? filter, int pageNumber = 1, int pageSize = 10);
        

        
    }
}
