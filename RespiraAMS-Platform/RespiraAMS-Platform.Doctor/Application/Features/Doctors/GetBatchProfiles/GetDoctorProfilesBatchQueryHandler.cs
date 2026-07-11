using Application.Abstracts.Data;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Doctors.GetBatchProfiles
{
    public class GetDoctorProfilesBatchQueryHandler(IDoctorDbContext dbContext)
    {
        public async Task<Dictionary<Guid, DoctorProfileDto>> HandleAsync(GetDoctorProfilesBatchQuery query)
        {
            var doctors = await dbContext.Doctors
                .Where(d => query.DoctorIds.Contains(d.Id) && !d.IsDeleted)
                .ToListAsync();

            return doctors.ToDictionary(
                d => d.Id,
                d => new DoctorProfileDto(
                    d.Id,
                    d.Address,
                    d.Degrees.Select(deg => deg.ToString()).ToList(),
                    d.AcademicTitle?.ToString(),
                    d.CitizenIdentificationCard,
                    d.Gender,
                    d.DateOfBirth,
                    d.Position.ToString(),
                    d.MediaId,
                    d.MediaUrl
                )
            );
        }
    }
}
