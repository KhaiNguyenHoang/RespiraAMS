using Application.Abstracts.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class MediaDbContext : DbContext, IMediaDbContext
    {
        public MediaDbContext(DbContextOptions<MediaDbContext> options) : base(options)
        {
        }

        public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
