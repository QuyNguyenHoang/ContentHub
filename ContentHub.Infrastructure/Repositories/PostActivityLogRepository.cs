using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ContentHub.Infrastructure.Repositories
{
    public class PostActivityLogRepository : IPostActivityLogRepository
    {
        private readonly ContentHubDbContext _context;
        public PostActivityLogRepository(ContentHubDbContext context)
        {

            _context = context;

        }
        public async Task<List<PostActivityLogDto>> GetPostActivityLogByIdAsync(Guid postId)
        {
            var postIdExisted = await _context.Posts.FindAsync(postId);
            if (postIdExisted == null)
            {
                throw new KeyNotFoundException("Post Id Invalid");
            }
            var postActivityLog = await _context.PostActivityLogs
                                .Where(p => p.PostId == postId)
                .Select(p => new PostActivityLogDto
                {
                    Id = postId,
                    FromStatus = p.FromStatus,
                    ToStatus = p.ToStatus,
                    DateCreated = p.DateCreated,
                    Note = p.Note,
                    AdminName = p.User != null ? p.User.GetFullName() : null,

                })
                .OrderByDescending(p => p.DateCreated)
                .ToListAsync();
            return postActivityLog;


        }
    }
}
