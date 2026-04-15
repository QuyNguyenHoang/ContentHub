namespace ContentHub.Domain.Data.Entities
{
    public class Reaction
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public Guid TargetId { get; set; }

        public ReactionTargetType TargetType { get; set; }

        public ReactionType Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    public enum ReactionType
    {
        None = 0,
        Like = 1,
        Love = 2,
        Haha = 3,
        Wow = 4,
        Sad = 5,
        Angry = 6,
        Dislike = 7
    }

    public enum ReactionTargetType
    {
        Post = 1,
        Comment = 2
    }
}
