using ContentHub.Application.Models.Contents.Reaction;
using ContentHub.Domain.Data.Entities;


namespace ContentHub.Application.IRepositories
{
    public interface IReactionRepository
    {
        Task<ReactionDto> NewReactionAsync(NewReactionDto newReactionDto);
        Task<Dictionary<ReactionType,int>> CountReactionInCommentAsync(Guid id);
        Task<Dictionary<ReactionType, int>> CountReactionInPostAsync(Guid id);
        Task DeleteReactionAsync(Guid id, Guid userId);
        Task<ReactionType> GetMyReactionAsync(Guid userId, Guid targetId, ReactionTargetType type);
    }
}
