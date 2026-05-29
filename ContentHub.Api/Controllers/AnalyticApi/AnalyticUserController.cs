using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.AnalyticDto;
using ContentHub.Application.Models.System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ContentHub.Api.Controllers.AnalyticApi
{
    [Route("api/admin/analytic/users")]
    [ApiController]
    public class AnalyticUserController : ControllerBase
    {
        private readonly IAnalyticRepository _analyticRepository;
        public AnalyticUserController(IAnalyticRepository analyticRepository)
        {
            _analyticRepository = analyticRepository;
        }
        [HttpGet("top-user-by-post")]
        public async Task<ActionResult<List<UserDto>>> GetTopUser()
        {
            var result = await _analyticRepository.TopUserByPostAsync();
            return Ok(result);
        }
        //total post
        [HttpGet("total-posts-count")]
        public async Task<ActionResult<TotalPostCountResponseDto>> GetTotalPosts(TimeRange timeRange)
        {
            var result = await _analyticRepository.GetTotalPostAsync(timeRange);
            return Ok(result);
        }
        //total user
        [HttpGet("total-users-count")]
        public async Task<ActionResult<TotalPostCountResponseDto>> GetTotalUsers(TimeRange timeRange)
        {
            var result = await _analyticRepository.GetTotalUserAsync(timeRange);
            return Ok(result);
        }
    }
}
