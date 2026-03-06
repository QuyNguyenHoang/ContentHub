using ContentHub.Domain.SeedWorks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace ContentHub.Infrastructure.SeedWorks
{
    public class RepositoryBase<T, Key> : IRepository<T, Key>
     where T : class
     where Key : notnull
    {
        protected readonly DbSet<T> _dbSet;
        protected readonly ContentHubDbContext _context;

        public RepositoryBase(ContentHubDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public IQueryable<T> GetAll()
        {
            return _dbSet.AsQueryable();
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public IQueryable<T> Find(Expression<Func<T, bool>> predicate)
        {
            return _dbSet.Where(predicate);
        }

        public async Task Add(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }
        public async Task<int> CompleteAsync()
        {
          
            return await _context.SaveChangesAsync();
        }

        public async Task<T?> GetByIdAsync(Key id)
        {
            return await _dbSet.FindAsync(id);
        }
    }
}
    
