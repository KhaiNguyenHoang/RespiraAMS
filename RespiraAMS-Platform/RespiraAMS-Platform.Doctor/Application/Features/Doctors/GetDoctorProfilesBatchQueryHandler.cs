using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstracts.Data;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Doctors
{
    public class GetDoctorProfilesBatchQueryHandler(IDoctorDbContext dbContext)
    {
        private readonly IDoctorDbContext _dbContext = dbContext;

        public async Task<Dictionary<Guid, DoctorProfileDto>> Handle(GetDoctorProfilesBatchQuery query)
        {
            var doctors = await _dbContext.Doctors
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
