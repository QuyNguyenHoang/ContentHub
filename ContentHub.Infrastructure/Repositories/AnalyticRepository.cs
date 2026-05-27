using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.System;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace ContentHub.Infrastructure.Repositories
{
    public class AnalyticRepository : IAnalyticRepository
    {
        private readonly ContentHubDbContext _context;

        public AnalyticRepository(ContentHubDbContext context)
        {
            _context = context;
        }
        public async Task<List<UserDto>> TopUserByPostAsync()
        {
            var topUser = await _context.Posts
                .GroupBy(p => p.AuthorUserId)
                 .Select(g => new
                 {
                     UserId = g.Key,
                     TotalPost = g.Count(),
                 })
                 .Join(_context.Users, g => g.UserId, u => u.Id, (g, u) => new UserDto
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
                     TotalPost = g.TotalPost,
                 })
                .OrderByDescending(g => g.TotalPost)
                .Take(10)
                .ToListAsync();

            return topUser;
        }
    }
}
