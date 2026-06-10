using Application.DTOs;

namespace Application.Abstracts
{
    public interface IDoctorServiceClient
    {
        Task<DoctorProfileDto?> GetDoctorProfileAsync(Guid doctorId);
        Task<Dictionary<Guid, DoctorProfileDto>> GetDoctorProfilesBatchAsync(IReadOnlyList<Guid> doctorIds);
    }
}
