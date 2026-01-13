using System.Linq.Expressions;

namespace ContentHub.Domain.SeedWorks
{
    public interface IRepository<T, Key> where T : class where Key : notnull
    {

        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(Key id);
        IQueryable<T> Find(Expression<Func<T, bool>> predicate);

        void Add(T entity);
        void AddRange(IEnumerable<T> entities);

        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
    }
}
