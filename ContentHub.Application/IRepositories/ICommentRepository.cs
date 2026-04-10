using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents.Comment;

namespace ContentHub.Application.IRepositories
{
    public interface ICommentRepository
    {
        public Task<CommentDto> NewCommentAsync(CommentRequestDto commentRequest);
        public Task<PagedResult<CommentDto>> GetListCommentInPostAsync(Guid postId, string? filter, int pageNumber = 1, int pageSize = 10);
        
    }
}
