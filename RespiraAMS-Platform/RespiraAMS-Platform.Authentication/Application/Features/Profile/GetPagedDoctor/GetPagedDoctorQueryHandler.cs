using Application.Abstracts;
using Application.Abstracts.Data;
using Application.DTOs;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Profile.GetPagedDoctor
{
    public class GetPagedDoctorQueryHandler(IAuthDbContext dbContext, IDoctorServiceClient doctorServiceClient)
    {
        public async Task<PagedDoctorsResult> HandleAsync(GetPagedDoctorQuery query)
        {
            var skip = Math.Max(0, query.Skip);
            var take = query.Take <= 0 ? 10 : query.Take;

            var dbQuery = dbContext.AuthDoctors.Where(d =>
                d.Role == RoleEnum.Doctor && !d.IsDeleted
            );

            var totalItems = await dbQuery.CountAsync();

            var authDoctors = await dbQuery
                .OrderBy(d => d.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            var doctorIds = authDoctors.ConvertAll(d => d.Id);
            var profilesDict = await doctorServiceClient.GetDoctorProfilesBatchAsync(doctorIds);

            var items = authDoctors.ConvertAll(doctor =>
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
            });

            var pageIndex = (skip / take) + 1;
            var totalPages = (int)Math.Ceiling((double)totalItems / take);

            var metadata = new PaginationMetadata
            {
                CurrentPage = pageIndex,
                PageSize = take,
                TotalItemCount = totalItems,
                PageCount = totalPages,
                HasPreviousPage = skip > 0,
                HasNextPage = skip + take < totalItems
            };

            return new PagedDoctorsResult(metadata, items);
        }
    }
}