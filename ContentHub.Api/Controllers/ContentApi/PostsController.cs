using AutoMapper;
using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/api")]
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
        [HttpGet("posts")]
        public async Task<ActionResult<PagedResult<PostDto>>> GetPostPaged(string? keyword,
            string? filter,
            int pageSize = 1,
            int pageNumber = 10)
        {
            var result = await _postRepository.GetPostPagingAsync(keyword, filter, pageSize, pageNumber);
            return Ok( result);
        }
    }
}
