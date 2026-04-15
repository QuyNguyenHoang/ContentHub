using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents.Comment
{
    public class CommentRequestDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public Guid PostId { get; set; }
        public Guid AuthId { get; set; }
        public CommentDepth Depth { get; set; }
        public Guid? ParentId { get; set; }
    }
}
