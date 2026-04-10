using ContentHub.Domain.Data.Identity;

namespace ContentHub.Domain.Data.Entities
{
    public class Comment
    {
        public Guid Id { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int LikeCount { get; set; } = 0;
        public bool IsDeleted { get; set; } = false;
        public CommentDepth Depth { get; set; } = CommentDepth.Root;
        // Foreign Keys
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public Guid? ParentId { get; set; }

        // Navigation Properties
        public AppUser? User { get; set; }
        public Post? Post { get; set; }

        // Self reference (reply)
        public Comment? Parent { get; set; }
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();


    }
    public enum CommentDepth : byte
    {
        Root = 0,
        Reply = 1,
        ReplyLv2 = 2,
    }
}