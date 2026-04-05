using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents.Comment;
using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;
using Microsoft.EntityFrameworkCore;

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
        public async Task<CommentDto> NewCommentAsync(CommentRequestDto req)
        {
            var checkUser = await _context.Users.Where(u => u.Id == req.AuthId).AnyAsync();
            if (!checkUser)
            {
                throw new KeyNotFoundException("user invalid");
            }
            var checkPost = await _context.Posts.Where(p=>p.Id == req.PostId).AnyAsync();
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
            };
            await _repo.Add(comment);
            await _context.SaveChangesAsync();
            return new CommentDto
            {
                Content = comment.Content,
                DateCreated = comment.CreatedAt,
                Author = comment.UserId.ToString(),
            };
        }
    }
}
