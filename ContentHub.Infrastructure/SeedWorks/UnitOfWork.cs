using ContentHub.Domain.SeedWorks;

namespace ContentHub.Infrastructure.SeedWorks
{

    public class UnitOfWork : IUnitOfWork
    {
        private readonly ContentHubDbContext _context;
        public UnitOfWork(ContentHubDbContext context)
        {
            _context = context;
        }
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
