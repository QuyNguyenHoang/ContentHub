using ContentHub.Domain.Data.Entities;

namespace ContentHub.Application.Models.Contents.Comment
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string? Content { get; set; }
        public DateTime? DateCreated { get; set; }
        public int LikeCount { get; set; }
        public CommentDepth Depth { get; set; }  
        public string? Avatar { get; set; }
        public string? Author {  get; set; }
        public Guid? ParentId { get; set; }
        public List<CommentDto> Children { get; set; } = new();


    }
}
