using ContentHub.Application.Models.Contents.Comment;

namespace ContentHub.Application.IRepositories
{
    public interface ICommentRepository
    {
        public Task<CommentDto> NewCommentAsync(CommentRequestDto commentRequest);   
    }
}
