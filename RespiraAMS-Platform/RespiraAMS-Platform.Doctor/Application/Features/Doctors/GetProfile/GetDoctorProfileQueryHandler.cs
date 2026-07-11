using Application.Abstracts.Data;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Doctors.GetProfile
{
    public class GetDoctorProfileQueryHandler(IDoctorDbContext dbContext)
    {
        public async Task<DoctorProfileDto?> HandleAsync(GetDoctorProfileQuery query)
        {
            var doctor = await dbContext.Doctors
                .FirstOrDefaultAsync(d => d.Id == query.Id && !d.IsDeleted);

            if (doctor == null)
            {
                return null;
            }

            return new DoctorProfileDto(
                doctor.Id,
                doctor.Address,
                doctor.Degrees.Select(d => d.ToString()).ToList(),
                doctor.AcademicTitle?.ToString(),
                doctor.CitizenIdentificationCard,
                doctor.Gender,
                doctor.DateOfBirth,
                doctor.Position.ToString(),
                doctor.MediaId,
                doctor.MediaUrl
            );
        }
    }
}
