using Marten.Linq;

namespace Application.Abstracts.Data;

public interface IDbContext
{
    IMartenQueryable<T> AsQueryable<T>() where T : class;
    void Add<T>(T entity) where T : class;
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}