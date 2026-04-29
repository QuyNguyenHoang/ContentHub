using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents.Reaction
{
    public class NewReactionDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid TargetId { get; set; }
        public ReactionTargetType TargetType { get; set; }

        public ReactionType Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
