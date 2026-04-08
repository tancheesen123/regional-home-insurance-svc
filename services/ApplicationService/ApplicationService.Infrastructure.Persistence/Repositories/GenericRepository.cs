using ApplicationService.Core.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ApplicationService.Infrastructure.Persistence.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly DbContextResolver _resolver;

        public GenericRepository(DbContextResolver resolver)
        {
            _resolver = resolver;
        }

        private DbSet<T> Set => _resolver.Resolve().Set<T>();

        public async Task<List<T>> GetAllAsync()
            => await Set.ToListAsync();

        public async Task<T?> GetByIdAsync(string id)
            => await Set.FindAsync(id);

        public async Task<T?> FindAsync(Expression<Func<T, bool>> predicate)
            => await Set.FirstOrDefaultAsync(predicate);

        public async Task<List<T>> FindAllAsync(Expression<Func<T, bool>> predicate)
            => await Set.Where(predicate).ToListAsync();

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
            => await Set.AnyAsync(predicate);

        public async Task AddAsync(T entity)
            => await Set.AddAsync(entity);

        public void Update(T entity)
            => Set.Update(entity);

        public void Delete(T entity)
            => Set.Remove(entity);

        public async Task SaveChangesAsync()
            => await _resolver.Resolve().SaveChangesAsync();
    }
}
