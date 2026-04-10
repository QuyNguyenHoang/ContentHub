using ContentHub.Application.IRepositories;
using ContentHub.Application.Models;
using ContentHub.Application.Models.Contents.Comment;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Globalization;
using System.Linq;

namespace ContentHub.Infrastructure.Repositories
{


    public class CommentRepository : ICommentRepository
    {
        private readonly ContentHubDbContext _context;
        private readonly IRepository<Comment, Guid> _repo;
        public CommentRepository(ContentHubDbContext context,
           IRepository<Comment, Guid> repo)
        {
            _context = context;
            _repo = repo;

        }



        public async Task<PagedResult<CommentDto>> GetListCommentInPostAsync(Guid postId, string? filter, int pageNumber = 1, int pageSize = 10)
        {
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            pageSize = pageSize < 10 ? 10 : pageSize;
            filter = filter?.ToLower().Trim();
            var query = _context.Comments.Where(c => c.PostId == postId).Include(c => c.User).AsNoTracking();
            var rootQuery = query.Where(c => c.ParentId == null);
            var checkPost = await _context.Posts.Where(p => p.Id == postId).AnyAsync();
            if (!checkPost)
            {
                throw new ArgumentException("PostId invalid");
            }
            if (!string.IsNullOrEmpty(filter))
            {
                switch (filter)
                {
                    case "newest":
                        rootQuery = rootQuery.OrderByDescending(c => c.CreatedAt);
                        break;
                    case "relevant":
                        rootQuery = rootQuery.OrderByDescending(c => c.LikeCount)
                            .ThenByDescending(c => c.CreatedAt);
                        break;
                    case "oldest":
                        rootQuery = rootQuery.OrderBy(c => c.CreatedAt);
                        break;
                    case "all":
                        rootQuery = rootQuery.OrderByDescending(c => c.Content.Length)
                            .ThenByDescending(c => c.CreatedAt);
                        break;
                    default:
                        rootQuery = rootQuery.OrderByDescending(c => c.CreatedAt);
                        break;
                }

            }


            var countRow = await rootQuery.CountAsync();

            var commentRoots = await rootQuery.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    DateCreated = c.CreatedAt,
                    LikeCount = c.LikeCount,
                    Depth = c.Depth,
                    Author = c.User != null ? c.User.GetFullName() : null,
                    Avatar = c.User != null ? c.User.Avatar : null
                })
                .ToListAsync();

            var rootIds = commentRoots.Select(c => c.Id).ToList();
            var replies = await _context.Comments.Include(c => c.User)
                .Where(r => r.PostId == postId && r.ParentId != null && rootIds.Contains(r.ParentId.Value))
                .ToListAsync();
            var replyDtos = replies.Select(x => new CommentDto
            {
                Id = x.Id,
                Content = x.Content,
                DateCreated = x.CreatedAt,
                LikeCount = x.LikeCount,
                Depth = x.Depth,
                ParentId = x.ParentId,
                Author = x.User != null ? x.User.GetFullName() : null,
                Avatar = x.User != null ? x.User.Avatar : null,
                Children = new List<CommentDto>()
            }).ToList();
            var replyIds = replies.Select(r => r.Id).ToList();

            var replieslv2 = await _context.Comments
                .Include(c => c.User)
                .Where(rp => rp.PostId == postId && rp.ParentId != null && replyIds.Contains(rp.ParentId.Value))
                .ToListAsync();
            var replyLv2Dtos = replieslv2.Select(x => new CommentDto
            {
                Id = x.Id,
                Content = x.Content,
                DateCreated = x.CreatedAt,
                LikeCount = x.LikeCount,
                Depth = x.Depth,
                ParentId = x.ParentId,
                Author = x.User != null ? x.User.GetFullName() : null,
                Avatar = x.User != null ? x.User.Avatar : null,
                Children = new List<CommentDto>()
            }).ToList();
            //build tree
            var map = new Dictionary<Guid, CommentDto>();
            foreach (var item in commentRoots.Concat(replyDtos).Concat(replyLv2Dtos))
            {
                map[item.Id] = item;
            }
            var result = new List<CommentDto>();
            foreach (var comment in map.Values)
            {
                if (comment.ParentId == null)
                {
                    result.Add(comment);
                }
                if (comment.ParentId.HasValue &&
                    map.TryGetValue(comment.ParentId.Value, out var parent))
                {
                    parent.Children.Add(comment);
                }
            }
            return new PagedResult<CommentDto>
            {
                Results = result,
                RowCount = countRow,
                CurrentPage = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<CommentDto> NewCommentAsync(CommentRequestDto req)
        {
            var checkUser = await _context.Users.Where(u => u.Id == req.AuthId).AnyAsync();
            if (!checkUser)
            {
                throw new KeyNotFoundException("user invalid");
            }
            var checkPost = await _context.Posts.Where(p => p.Id == req.PostId).AnyAsync();
            if (!checkPost)
            {
                throw new KeyNotFoundException("post invalid");
            }
            var comment = new Comment()
            {
                Content = req.Content,
                UserId = req.AuthId,
                PostId = req.PostId,
                CreatedAt = DateTime.UtcNow,
                Depth = req.Depth,
                ParentId = req.ParentId,
            };
            await _repo.Add(comment);
            await _context.SaveChangesAsync();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == req.AuthId);

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                DateCreated = comment.CreatedAt,
                Author = user?.GetFullName() ?? "Guest",
                Avatar = user?.Avatar
            };
        }


    }
}
