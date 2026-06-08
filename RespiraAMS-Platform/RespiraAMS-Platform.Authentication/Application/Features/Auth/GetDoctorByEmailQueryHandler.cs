using System;
using System.Threading.Tasks;
using Application.Abstracts;
using Application.Abstracts.Data;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Auth
{
    public class GetDoctorByEmailQueryHandler(IAuthDbContext dbContext, IDoctorServiceClient doctorServiceClient)
    {
        private readonly IAuthDbContext _dbContext = dbContext;
        private readonly IDoctorServiceClient _doctorServiceClient = doctorServiceClient;

        public async Task<DoctorResponseDto?> Handle(GetDoctorByEmailQuery query)
        {
            var emailNormal = query.Email.ToLower().Trim();
            var doctor = await _dbContext.AuthDoctors
                .FirstOrDefaultAsync(d => d.Email.ToLower() == emailNormal && d.Role == RoleEnum.Doctor && !d.IsDeleted);

            if (doctor == null)
            {
                return null;
            }

            var profile = await _doctorServiceClient.GetDoctorProfileAsync(doctor.Id);

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
