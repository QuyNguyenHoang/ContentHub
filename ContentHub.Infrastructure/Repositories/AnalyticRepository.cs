using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.AnalyticDto;
using ContentHub.Application.Models.System.UserDto;
using ContentHub.Domain.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ContentHub.Infrastructure.Repositories
{
    public class AnalyticRepository : IAnalyticRepository
    {
        private readonly ContentHubDbContext _context;
        private readonly DateRangeResolver _dateRangeResolver;
        public AnalyticRepository(ContentHubDbContext context,
            DateRangeResolver dateRangeResolver)
        {
            _context = context;
            _dateRangeResolver = dateRangeResolver;
        }
        public async Task<List<UserResponseDto>> TopUserByPostAsync()
        {
            var topUser = await _context.Posts
                .GroupBy(p => p.AuthorUserId)
                 .Select(g => new
                 {
                     UserId = g.Key,
                     TotalPost = g.Count(),
                 })
                 .Join(_context.Users, g => g.UserId, u => u.Id, (g, u) => new UserResponseDto
                 {
                     Id = u.Id,
                     UserName =
                      !string.IsNullOrWhiteSpace(u.FirstName) &&
                        !string.IsNullOrWhiteSpace(u.LastName)
                            ? (u.FirstName + " " + u.LastName)
                            : (!string.IsNullOrWhiteSpace(u.UserName)
                                ? u.UserName
                                : ""),
                     Avatar = u.Avatar,
                     DateCreated = u.DateCreated,
                     Email = u.Email!,
                     TotalPost = g.TotalPost,
                 })
                .OrderByDescending(g => g.TotalPost)
                .Take(10)
                .ToListAsync();

            return topUser;
        }
        //Get total post time range
        public async Task<TotalPostCountResponseDto> GetTotalPostAsync(TimeRange timeRange)
        {
            var (from, to) = _dateRangeResolver.Resolve(timeRange);

            // CURRENT PERIOD
            var query = _context.Posts
                .Where(p =>
                    p.Status == PostStatus.Published &&
                    (!from.HasValue || p.DateCreated >= from) &&
                    (!to.HasValue || p.DateCreated <= to));

            var totalPost = await query.CountAsync();

            // PREVIOUS PERIOD
            var duration = (to ?? DateTime.UtcNow) - (from ?? DateTime.UtcNow.AddDays(-7));

            var previousFrom = from.HasValue
                ? from.Value.Add(-duration)
                : DateTime.UtcNow.AddDays(-14);

            var previousTo = from ?? DateTime.UtcNow;

            var previousPost = await _context.Posts
                .Where(p =>
                    p.Status == PostStatus.Published &&
                    p.DateCreated >= previousFrom &&
                    p.DateCreated <= previousTo)
                .CountAsync();

            // GROWTH %
            double growth = previousPost == 0
                ? 100
                : (double)(totalPost - previousPost) / previousPost * 100;

            return new TotalPostCountResponseDto
            {
                TotalPost = totalPost,
                PreviousTotalPost = previousPost,
                Growth = Math.Round(growth, 2)
            };
        }
        //Total user
        public async Task<TotalUserCountResponseDto> GetTotalUserAsync(TimeRange timeRange)
        {
            var (from, to) = _dateRangeResolver.Resolve(timeRange);

            // CURRENT PERIOD
            var query = _context.Users
                .Where(u =>
                    u.IsActive == true &&
                    (!from.HasValue || u.DateCreated >= from) &&
                    (!to.HasValue || u.DateCreated <= to));

            var totalUser = await query.CountAsync();

            // PREVIOUS PERIOD
            var duration = (to ?? DateTime.UtcNow) - (from ?? DateTime.UtcNow.AddDays(-7));

            var previousFrom = from.HasValue
                ? from.Value.Add(-duration)
                : DateTime.UtcNow.AddDays(-14);

            var previousTo = from ?? DateTime.UtcNow;

            var previousUser = await _context.Users
                .Where(u =>
                    u.IsActive == true &&
                    u.DateCreated >= previousFrom &&
                    u.DateCreated <= previousTo)
                .CountAsync();

            // GROWTH %
            double growth = previousUser == 0
                ? 100
                : (double)(totalUser - previousUser) / previousUser * 100;

            return new TotalUserCountResponseDto
            {
                TotalUser = totalUser,
                PreviousTotalUser = previousUser,
                Growth = Math.Round(growth, 2)
            };
        }
    }
}
