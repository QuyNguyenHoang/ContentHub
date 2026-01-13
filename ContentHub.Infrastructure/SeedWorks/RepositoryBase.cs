using ContentHub.Domain.SeedWorks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace ContentHub.Infrastructure.SeedWorks
{
    public class RepositoryBase<T, Key> : IRepository<T, Key> where T : class where Key : notnull
    {
        private readonly DbSet<T> _dbSet;
        private readonly ContentHubDbContext _context;
        public RepositoryBase(ContentHubDbContext context)
        {
            _dbSet = context.Set<T>();
            _context = context;

        }
        public async Task<T?> GetByIdAsync(Key id)
        {
            return await _dbSet.FindAsync(id);
        }
        public IQueryable<T> Find(Expression<Func<T, bool>> expression)
        {
            return _dbSet.Where(expression);
        }
        public void Add(T entity)
        {
             _dbSet.Add(entity);
        }
        public void AddRange(IEnumerable<T> entities)
        {
            _dbSet.AddRange(entities);
        }
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }
        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }
        public void RemoveRange(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }
    }
}
    
