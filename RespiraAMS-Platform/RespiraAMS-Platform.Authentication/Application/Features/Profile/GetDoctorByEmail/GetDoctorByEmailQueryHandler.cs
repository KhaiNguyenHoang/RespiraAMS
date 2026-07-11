using Application.Abstracts;
using Application.Abstracts.Data;
using Application.DTOs;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Profile.GetDoctorByEmail
{
    public class GetDoctorByEmailQueryHandler(IAuthDbContext dbContext, IDoctorServiceClient doctorServiceClient)
    {
        public async Task<DoctorResponseDto?> HandleAsync(GetDoctorByEmailQuery query)
        {
            var emailNormal = query.Email.ToLower().Trim();
            var doctor = await dbContext.AuthDoctors
                .FirstOrDefaultAsync(d =>
                    d.Email.Equals(emailNormal, StringComparison.CurrentCultureIgnoreCase) &&
                    d.Role == RoleEnum.Doctor && !d.IsDeleted);

            if (doctor == null)
            {
                return null;
            }

            var profile = await doctorServiceClient.GetDoctorProfileAsync(doctor.Id);

            return new DoctorResponseDto(
                doctor.Id,
                doctor.FirstName,
                doctor.LastName,
                doctor.Email,
                doctor.PhoneNumber,
                doctor.Role.ToString(),
                doctor.CreatedAt,
                profile?.Address ?? string.Empty,
                profile?.Degrees ?? Array.Empty<string>(),
                profile?.AcademicTitle,
                profile?.CitizenIdentificationCard ?? string.Empty,
                profile?.Gender ?? false,
                profile?.DateOfBirth,
                profile?.Position ?? string.Empty,
                profile?.MediaId,
                profile?.MediaUrl
            );
        }
    }
}