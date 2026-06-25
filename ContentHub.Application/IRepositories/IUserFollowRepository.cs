namespace ContentHub.Application.IRepositories
{
    public interface IUserFollowRepository
    {
        Task FollowAsync(Guid followerId, Guid followingId);

        Task UnfollowAsync(Guid followerId, Guid followingId);

        Task<bool> IsFollowingAsync(Guid followerId, Guid followingId);

        Task<int> GetFollowersCountAsync(Guid userId);

        Task<int> GetFollowingCountAsync(Guid userId);

        Task<List<Guid>> GetFollowersAsync(Guid userId);

        Task<List<Guid>> GetFollowingAsync(Guid userId);
    }
}
