using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("admin/api/post_activity_logs")]
    [ApiController]
    public class PostActivityLogController : ControllerBase
    {
        private readonly IPostActivityLogRepository _postActivityLog;
        public PostActivityLogController(IPostActivityLogRepository postActivityLog)
        {
            _postActivityLog = postActivityLog;
        }
        [HttpGet]
        //[Authorize(Policy = Permissions.Posts.View)]
        public async Task<ActionResult<List<PostActivityLogDto>>> GetPostActivityLog(Guid postId)
        {
            var result = await _postActivityLog.GetPostActivityLogByIdAsync(postId);
            return Ok(result);
        }

    }
}
