using ContentHub.Application.IRepositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ContentHub.Api.Controllers.ContentApi
{
    [Route("api/follow")]
    [ApiController]
    [Authorize]
    public class UserFollowController : ControllerBase
    {
        private readonly IUserFollowRepository _userFollowRepository;

        public UserFollowController(IUserFollowRepository userFollowRepository)
        {
            _userFollowRepository = userFollowRepository;
        }

        [HttpPost("{followingId:guid}")]
        public async Task<IActionResult> Follow(Guid followingId)
        {
            var followerId = GetCurrentUserId();

            await _userFollowRepository.FollowAsync(
                followerId,
                followingId);

            return Ok(new
            {
                Success = true,
                Message = "Followed successfully"
            });
        }

        [HttpDelete("{followingId:guid}")]
        public async Task<IActionResult> Unfollow(Guid followingId)
        {
            var followerId = GetCurrentUserId();

            await _userFollowRepository.UnfollowAsync(
                followerId,
                followingId);

            return Ok(new
            {
                Success = true,
                Message = "Unfollowed successfully"
            });
        }

        [HttpGet("is-following/{followingId:guid}")]
        public async Task<IActionResult> IsFollowing(Guid followingId)
        {
            var followerId = GetCurrentUserId();

            var result = await _userFollowRepository.IsFollowingAsync(
                followerId,
                followingId);

            return Ok(new
            {
                IsFollowing = result
            });
        }

        [HttpGet("{userId:guid}/followers/count")]
        public async Task<IActionResult> GetFollowersCount(Guid userId)
        {
            var count = await _userFollowRepository.GetFollowersCountAsync(userId);

            return Ok(new
            {
                Count = count
            });
        }

        [HttpGet("{userId:guid}/following/count")]
        public async Task<IActionResult> GetFollowingCount(Guid userId)
        {
            var count = await _userFollowRepository.GetFollowingCountAsync(userId);

            return Ok(new
            {
                Count = count
            });
        }

        [HttpGet("{userId:guid}/followers")]
        public async Task<IActionResult> GetFollowers(Guid userId)
        {
            var followers = await _userFollowRepository.GetFollowersAsync(userId);

            return Ok(followers);
        }

        [HttpGet("{userId:guid}/following")]
        public async Task<IActionResult> GetFollowing(Guid userId)
        {
            var following = await _userFollowRepository.GetFollowingAsync(userId);

            return Ok(following);
        }

        private Guid GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            return Guid.Parse(userId);
        }
    }
}