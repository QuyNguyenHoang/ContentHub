using ContentHub.Api.Services;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents.Comment;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

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
        [Authorize(Policy = Permissions.Commment.Create)]
        public async Task<ActionResult<CommentDto>> NewComment(CommentRequestDto commentReq)
        {
            var result = await _commentRepo.NewCommentAsync(commentReq);
            await _hub.Clients
                .Group(commentReq.PostId.ToString())
                .SendAsync("ReceiveComment", result);
            return Ok(result);
        }
        [HttpGet]
        [Authorize(Policy = Permissions.Commment.View)]
        public async Task<ActionResult<PagedResult<CommentDto>>> ListCommnentPaged(Guid postId,
            string? filter,
            int pageNumber = 1,
            int pageSize = 10)
        {
            var result = await _commentRepo.GetListCommentInPostAsync(postId, filter, pageNumber, pageSize);
            return Ok(result);
        }
        [HttpDelete("{id}")]
        [Authorize(Policy = Permissions.Commment.Delete)]
        public async Task<ActionResult> DeleteComment(Guid id)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!Guid.TryParse(userIdString, out var userId))
                {
                    return Unauthorized();
                }

                await _commentRepo.DeleteCommentAsync(id, userId);

                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

    }
}
