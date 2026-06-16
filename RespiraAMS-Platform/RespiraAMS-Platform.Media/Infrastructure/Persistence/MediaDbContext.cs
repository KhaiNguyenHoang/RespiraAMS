using Application.Abstracts.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class MediaDbContext(DbContextOptions<MediaDbContext> options)
        : DbContext(options),
            IMediaDbContext
    {
        public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
