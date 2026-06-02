using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstracts.Data
{
    public interface IAuthDbContext
    {
        DbSet<AuthDoctor> AuthDoctors { get; }
        DbSet<BlacklistToken> BlacklistTokens { get; }
        DbSet<Token> Tokens { get; }
        DbSet<ProcessTracker> ProcessTrackers { get; }

        Task<int> SaveChangesAsync();
    }
}
