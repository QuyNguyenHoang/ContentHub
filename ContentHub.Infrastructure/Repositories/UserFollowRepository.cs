using ContentHub.Application.IRepositories;
using ContentHub.Domain.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class UserFollowRepository : IUserFollowRepository
    {
        private readonly ContentHubDbContext _context;

        public UserFollowRepository(ContentHubDbContext context)
        {
            _context = context;
        }

        public async Task FollowAsync(Guid followerId, Guid followingId)
        {
            // Không được follow chính mình
            if (followerId == followingId)
            {
                throw new InvalidOperationException(
                    "You cannot follow yourself.");
            }

            // Kiểm tra người follow tồn tại
            var followerExists = await _context.Users
                .AnyAsync(x => x.Id == followerId);

            if (!followerExists)
            {
                throw new KeyNotFoundException(
                    $"Follower '{followerId}' was not found.");
            }

            // Kiểm tra người được follow tồn tại
            var followingExists = await _context.Users
                .AnyAsync(x => x.Id == followingId);

            if (!followingExists)
            {
                throw new KeyNotFoundException(
                    $"Following user '{followingId}' was not found.");
            }

            // Kiểm tra đã follow chưa
            var alreadyFollowing = await _context.UserFollows
                .AnyAsync(x =>
                    x.FollowerId == followerId &&
                    x.FollowingId == followingId);

            if (alreadyFollowing)
            {
                throw new InvalidOperationException(
                    "You are already following this user.");
            }

            var follow = new UserFollow
            {
                FollowerId = followerId,
                FollowingId = followingId,
                CreatedAt = DateTime.UtcNow
            };

            await _context.UserFollows.AddAsync(follow);

            await _context.SaveChangesAsync();
        }

        public async Task UnfollowAsync(Guid followerId, Guid followingId)
        {
            var follow = await _context.UserFollows
                .FirstOrDefaultAsync(x =>
                    x.FollowerId == followerId &&
                    x.FollowingId == followingId);

            if (follow == null)
            {
                throw new KeyNotFoundException(
                    "Follow relationship not found.");
            }

            _context.UserFollows.Remove(follow);

            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsFollowingAsync(
            Guid followerId,
            Guid followingId)
        {
            return await _context.UserFollows
                .AnyAsync(x =>
                    x.FollowerId == followerId &&
                    x.FollowingId == followingId);
        }

        public async Task<int> GetFollowersCountAsync(Guid userId)
        {
            return await _context.UserFollows
                .CountAsync(x => x.FollowingId == userId);
        }

        public async Task<int> GetFollowingCountAsync(Guid userId)
        {
            return await _context.UserFollows
                .CountAsync(x => x.FollowerId == userId);
        }

        public async Task<List<Guid>> GetFollowersAsync(Guid userId)
        {
            return await _context.UserFollows
                .Where(x => x.FollowingId == userId)
                .Select(x => x.FollowerId)
                .ToListAsync();
        }

        public async Task<List<Guid>> GetFollowingAsync(Guid userId)
        {
            return await _context.UserFollows
                .Where(x => x.FollowerId == userId)
                .Select(x => x.FollowingId)
                .ToListAsync();
        }
    }
}