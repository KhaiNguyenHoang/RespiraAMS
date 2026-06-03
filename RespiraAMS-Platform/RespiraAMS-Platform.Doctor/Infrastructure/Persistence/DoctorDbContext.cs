using Application.Abstracts.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class DoctorDbContext(DbContextOptions<DoctorDbContext> options)
        : DbContext(options),
            IDoctorDbContext
    {
        public DbSet<Doctor> Doctors => Set<Doctor>();

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
