using ContentHub.Domain.Data.Entities;
using ContentHub.Domain.SeedWorks;

namespace ContentHub.Application.IRepositories
{
    public interface ICategoryRepository : IRepository<PostCategory, Guid>
    {
        Task<bool> CategoryExistsAsync(Guid categoryId);

    }
}
