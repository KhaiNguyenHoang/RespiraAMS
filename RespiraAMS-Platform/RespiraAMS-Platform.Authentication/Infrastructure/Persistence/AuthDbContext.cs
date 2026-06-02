using Application.Abstracts.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class AuthDbContext : DbContext, IAuthDbContext
    {
        public DbSet<AuthDoctor> AuthDoctors => Set<AuthDoctor>();

        public DbSet<BlacklistToken> BlacklistTokens => Set<BlacklistToken>();

        public DbSet<Token> Tokens => Set<Token>();

        public DbSet<ProcessTracker> ProcessTrackers => Set<ProcessTracker>();

        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }
    }
}
