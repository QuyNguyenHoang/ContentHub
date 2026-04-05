namespace ContentHub.Application.Models.Contents.Comment
{
    public class CommentRequestDto
    {
        public string Content { get; set; }
        public Guid PostId { get; set; }
        public Guid AuthId { get; set; }
    }
}
