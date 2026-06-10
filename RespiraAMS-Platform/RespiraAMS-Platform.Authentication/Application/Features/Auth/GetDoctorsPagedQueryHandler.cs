using Application.Abstracts;
using Application.Abstracts.Data;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Auth
{
    public class GetDoctorsPagedQueryHandler(IAuthDbContext dbContext, IDoctorServiceClient doctorServiceClient)
    {
        private readonly IAuthDbContext _dbContext = dbContext;
        private readonly IDoctorServiceClient _doctorServiceClient = doctorServiceClient;

        public async Task<PagedDoctorsResult> Handle(GetDoctorsPagedQuery query)
        {
            var skip = Math.Max(0, query.Skip);
            var take = query.Take <= 0 ? 10 : query.Take;

            var dbQuery = _dbContext.AuthDoctors
                .Where(d => d.Role == RoleEnum.Doctor && !d.IsDeleted);

            var totalItems = await dbQuery.CountAsync();

            var authDoctors = await dbQuery
                .OrderBy(d => d.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            var doctorIds = authDoctors.Select(d => d.Id).ToList();
            var profilesDict = await _doctorServiceClient.GetDoctorProfilesBatchAsync(doctorIds);

            var items = authDoctors.Select(doctor =>
            {
                profilesDict.TryGetValue(doctor.Id, out var profile);
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
            }).ToList();

            var pageIndex = (skip / take) + 1;
            var totalPages = (int)Math.Ceiling((double)totalItems / take);

            var metadata = new PagingMetadata(
                pageIndex,
                take,
                totalItems,
                totalPages,
                skip > 0,
                skip + take < totalItems
            );

            return new PagedDoctorsResult(metadata, items);
        }
    }
}
