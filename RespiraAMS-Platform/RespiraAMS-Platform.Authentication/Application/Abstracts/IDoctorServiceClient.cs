using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Abstracts
{
    public interface IDoctorServiceClient
    {
        Task<DoctorProfileDto?> GetDoctorProfileAsync(Guid doctorId);
        Task<Dictionary<Guid, DoctorProfileDto>> GetDoctorProfilesBatchAsync(IReadOnlyList<Guid> doctorIds);
    }
}
