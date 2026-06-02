using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstracts.Data
{
    public interface IDoctorDbContext
    {
        DbSet<Doctor> Doctors { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
