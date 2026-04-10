using ContentHub.Application.IRepositories;
using ContentHub.Application.Models.Contents.Comment;
using ContentHub.Domain.Data.Entities;
using Microsoft.AspNetCore.SignalR;

namespace ContentHub.Api.Services
{
    public class CommentHub : Hub
    {
        private readonly ICommentRepository _commentRepository;
        public CommentHub(ICommentRepository commentRepository) { _commentRepository = commentRepository; }
        public async Task JoinPost(string postId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, postId);
        }
        public async Task LeavePost(string postId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, postId);
        }
        

    }
}
