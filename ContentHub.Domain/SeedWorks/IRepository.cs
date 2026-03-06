using System.Linq.Expressions;

namespace ContentHub.Domain.SeedWorks
{
    public interface IRepository<T, Key>
     where T : class
     where Key : notnull
    {
        IQueryable<T> GetAll();
        Task<List<T>> GetAllAsync();

        Task<T?> GetByIdAsync(Key id);

        IQueryable<T> Find(Expression<Func<T, bool>> predicate);

        Task Add(T entity);

        Task AddRangeAsync(IEnumerable<T> entities);
        Task<int> CompleteAsync();

        void Remove(T entity);

        void RemoveRange(IEnumerable<T> entities);
    }
}
