using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using ContentHub.Domain.SeedWorks.Constant;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("admin/api/posts")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;

        public PostsController(IPostRepository postRepository, IMapper mapper)
        {
            _postRepository = postRepository;
            _mapper = mapper;
        }

        // GET: admin/api/posts
        [HttpGet]
        public async Task<ActionResult<PagedResult<PostDto>>> GetPostPaged(
            [FromQuery] string? keyword,
            [FromQuery] string? filter,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            bool isAdmin = false)

        {
            var result = await _postRepository.GetPostPagedAsync(keyword, filter, pageNumber, pageSize, isAdmin);
            return Ok(result);
        }

        // GET: admin/api/posts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetById(Guid id)
        {
            var result = await _postRepository.GetPostById(id);
            return Ok(result);
        }

        // POST: admin/api/posts/new
        [HttpPost("new")]
        public async Task<ActionResult<PostDto>> AddNewPost([FromBody] CreatePostRequest postRequest)
        {
            var result = await _postRepository.AddNewPostAsync(postRequest);
            return Ok(result);
        }

        // PUT: admin/api/posts/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<PostDto>> Update(Guid id, [FromBody] CreatePostRequest request)
        {
            var result = await _postRepository.UpdatePostAsync(id, request);
            return Ok(result);
        }

        // DELETE: admin/api/posts
        [HttpDelete]
        public async Task<ActionResult> Delete([FromBody] Guid[] ids)
        {
            var deletedCount = await _postRepository.DeletePostAsync(ids);
            return Ok(new { deletedCount });
        }

        // POST: admin/api/posts/{id}/approve
        [Authorize(Policy = Permissions.Posts.Edit)]
        [HttpPost("{id}/approve")]
        public async Task<ActionResult> Approve(Guid id)
        {
            var adminIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(adminIdString, out var adminId))
            {
                return Unauthorized();
            }

            await _postRepository.Approve(id, adminId);
            return Ok("Approved successfully");
        }

        // POST: admin/api/posts/{id}/reject
        [HttpPost("{id}/reject")]
        public async Task<ActionResult> Reject(Guid id, [FromQuery] Guid authorId)
        {
            await _postRepository.ReturnBack(id, authorId);
            return Ok("Rejected successfully");
        }

        // GET: admin/api/posts/{id}/reasons
        [HttpGet("{id}/reasons")]
        public async Task<ActionResult<List<string?>>> GetReasons(Guid id)
        {
            var result = await _postRepository.GetReturnReason(id);
            return Ok(result);
        }

        // POST: admin/api/posts/{id}/send-approve
        [HttpPost("{id}/send-approve")]
        public async Task<ActionResult> SendToApprove(Guid id, [FromQuery] Guid authorId)
        {
            await _postRepository.SentToApprove(id, authorId);
            return Ok("Sent to approve");
        }
        [HttpGet("post-by-user")]
        public async Task<ActionResult<PostDto>> GetPostByUser(Guid userId)
        {
            var result = await _postRepository.GetPostByUser(userId);
            return Ok(result);
        }
    }
}