using ContentHub.Api.Services;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents.Comment;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/comments")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepo;

        private readonly IHubContext<CommentHub> _hub;
        public CommentController(ICommentRepository commentRepo,
            IHubContext<CommentHub> hub)
        {
            _commentRepo = commentRepo;
            _hub = hub;

        }
        [HttpPost]
        public async Task<ActionResult<CommentDto>> NewComment(CommentRequestDto commentReq)
        {
            var result = await _commentRepo.NewCommentAsync(commentReq);
            await _hub.Clients
                .Group(commentReq.PostId.ToString())
                .SendAsync("ReceiveComment", result);
            return Ok(result);
        }
        [HttpGet]
        public async Task<ActionResult<PagedResult<CommentDto>>> ListCommnentPaged(Guid postId,
            string? filter,
            int pageNumber = 1,
            int pageSize = 10)
        {
            var result = await _commentRepo.GetListCommentInPostAsync(postId, filter, pageNumber, pageSize);
            return Ok(result);
        }
    }
}
