using Application.Abstracts.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class AuthDbContext(DbContextOptions<AuthDbContext> options)
        : DbContext(options),
            IAuthDbContext
    {
        public DbSet<AuthDoctor> AuthDoctors => Set<AuthDoctor>();

        public DbSet<BlacklistToken> BlacklistTokens => Set<BlacklistToken>();

        public DbSet<Token> Tokens => Set<Token>();

        public DbSet<ProcessTracker> ProcessTrackers => Set<ProcessTracker>();

        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AuthDoctor>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.PhoneNumber).IsUnique();
            });
        }
    }
}
