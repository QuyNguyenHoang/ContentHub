using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents.Reaction;
using ContentHub.Domain.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class ReactionRepository : IReactionRepository
    {
        private readonly ContentHubDbContext _context;
        public ReactionRepository(ContentHubDbContext context) { _context = context; }
        public async Task<ReactionDto> NewReactionAsync(NewReactionDto dto)
        {
            var userId = await _context.Users.FindAsync(dto.UserId);
            if (userId == null)
            {
                throw new KeyNotFoundException("User Id invalid");
            }
            if (dto.TargetType == ReactionTargetType.Post)
            {
                var checkPostId = await _context.Posts.FindAsync(dto.TargetId);
                if (checkPostId == null)
                {
                    throw new KeyNotFoundException("PostId invalid");
                }
            }
            else
            {
                var checkComment = await _context.Comments.FindAsync(dto.TargetId);
                if (checkComment == null)
                    throw new KeyNotFoundException("CommentId invalid");
            }

            var reaction = await _context.Reactions.FirstOrDefaultAsync(x =>
                x.UserId == dto.UserId &&
                x.TargetId == dto.TargetId &&
                x.TargetType == dto.TargetType
            );

            if (reaction == null)
            {
                reaction = new Reaction
                {
                    Id = Guid.NewGuid(),
                    UserId = dto.UserId,
                    TargetId = dto.TargetId,
                    TargetType = dto.TargetType,
                    Type = dto.Type,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Reactions.AddAsync(reaction);
            }
            else
            {
                reaction.Type = dto.Type;
                reaction.CreatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return new ReactionDto
            {
                Id = reaction.Id,
                UserId = reaction.UserId,
                TargetId = reaction.TargetId,
                TargetType = reaction.TargetType,
                Type = reaction.Type,
                CreatedAt = reaction.CreatedAt
            };
        }
        public async Task<Dictionary<ReactionType, int>> CountReactionInCommentAsync(Guid id)
        {
            return await _context.Reactions
                .Where(r => r.TargetType == ReactionTargetType.Comment && r.TargetId == id)
                .GroupBy(r => r.Type)
                .Select(r => new
                {
                    Type = r.Key,
                    Count = r.Count()
                })
                .ToDictionaryAsync(r => r.Type, r => r.Count);
        }
        public async Task<Dictionary<ReactionType, int>> CountReactionInPostAsync(Guid id)
        {
            return await _context.Reactions
                .Where(r => r.TargetId == id && r.TargetType == ReactionTargetType.Post)
                .GroupBy(r => r.Type)
                .Select(r => new
                {
                    Type = r.Key,
                    Count = r.Count()
                })
                .ToDictionaryAsync(r => r.Type, r => r.Count);
        }
        public async Task<ReactionType> GetMyReactionAsync(Guid userId, Guid targetId, ReactionTargetType type)
        {
            return await _context.Reactions.Where(r => r.UserId == userId && r.TargetId == targetId && r.TargetType == type)
                .Select(r => r.Type)
                .FirstOrDefaultAsync();
        }

        public async Task DeleteReactionAsync(Guid id, Guid userId)
        {
            var reaction = await _context.Reactions
          .FirstOrDefaultAsync(r => r.UserId == userId && r.Id == id);

            if (reaction != null)
            {
                _context.Reactions.Remove(reaction);
                await _context.SaveChangesAsync();
            }
        }
    }
}
