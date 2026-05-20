using ContentHub.Application.Models.Contents;

namespace ContentHub.Application.IRepositories
{
    public interface IPostActivityLogRepository
    {
        Task<List<PostActivityLogDto>> GetPostActivityLogByIdAsync(Guid postId);
    }
}
