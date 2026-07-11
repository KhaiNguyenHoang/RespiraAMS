using Application.Abstracts.Data;
using Marten;
using Marten.Linq;

namespace Infrastructure.Data;

public class AppDbContext(IDocumentSession session) : IDbContext
{
    public IMartenQueryable<T> AsQueryable<T>() where T : class
    {
        return session.Query<T>();
    }

    public void Add<T>(T entity) where T : class
    {
        session.Store(entity);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await session.SaveChangesAsync(cancellationToken);
    }
}