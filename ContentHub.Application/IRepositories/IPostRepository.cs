using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;

namespace ContentHub.Application.IRepositories
{
    public interface IPostRepository : IRepository<Post, Guid>
    {
        Task<bool> IsSlugAlreadyExisted(string? slug, Guid? currentId = null);
        Task<bool> IsNameExistsAsync(string name);
        Task<bool> IsAuthorExisted(Guid authorId);
        Task<bool> IsCategoryExisted(Guid? categoryId);
        Task<bool> IsPostExisted(Guid id);
        Task<PagedResult<PostDto>> GetPostPagedAsync(string? keyword, string? filter, int pageNumber = 1, int pageSize = 10, bool isAdmin = false);
        Task<PostDto> AddNewPostAsync(CreatePostRequest postRequest);
        Task<PostDto> GetPostById(Guid postId);
        Task<List<PostDto>> GetPostByUserId(Guid userId);
        Task<PostDto> GetPostByUser(Guid userId);
        Task<PagedResult<PostDto>> GetPostByUserPagedAsync(Guid userId,
                     string? keyword,
            string? filter,
            int pageNumber = 1,
            int pageSize = 10);
        Task Approve(Guid id, Guid adminId);
        Task ReturnBack(Guid id, Guid adminId);
        Task<List<string?>> GetReturnReason(Guid id);
        Task<bool> HasPublicInLast(Guid id);
        Task SentToApprove(Guid id, Guid authorId);
        Task<PostDto> UpdatePostAsync(Guid id, CreatePostRequest postRequest);
        Task<int> DeletePostAsync(Guid[] ids, bool isSoftDelete);
        //Total posts
        Task<int> GetTotalPostsAsync();
        //List post deleted
        Task<PagedResult<PostDto>> GetListPostDeletedAsync(string? keyword, string? filter , int pageNumber = 1,int pageSize = 10);
        //Restore deleted post
        Task<int> RestoreDeletedPostAsync(Guid[] ids);

    }
}
