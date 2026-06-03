using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstracts.Data
{
    public interface IMediaDbContext
    {
        DbSet<MediaAsset> MediaAssets { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
