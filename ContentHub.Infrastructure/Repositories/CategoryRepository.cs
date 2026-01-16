using ContentHub.Application.IRepositories;
using ContentHub.Domain.Data.Entities;
using ContentHub.Infrastructure.SeedWorks;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Infrastructure.Repositories
{
    public class CategoryRepository : RepositoryBase<PostCategory, Guid>,ICategoryRepository
    {
        private readonly ContentHubDbContext _context;
        public CategoryRepository(ContentHubDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<bool> CategoryExistsAsync(Guid categoryId)
        {
            return await _context.PostCategories
                       .AnyAsync(x => x.Id == categoryId);
        }
    }
}
